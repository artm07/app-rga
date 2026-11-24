// Contas no próprio aparelho (modo demonstração, usado quando não há servidor).
// Cada aparelho/navegador tem as suas contas: o administrador só vê as criadas ali.
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { demoUserData, newUserData, initialGlobal, DEMO_ACCOUNT, newId } from '../data';
import { ROLES, normEmail, validateSignup, summarizeUser, computeStats, checkAdminChange, tempPassword } from './shared';

const K = { users: 'rga:contas', global: 'rga:global', data: (id) => `rga:dados:${id}` };

const fail = (code, message) => {
  throw { code, message };
};

async function read(key, fallback) {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
const write = (key, value) => AsyncStorage.setItem(key, JSON.stringify(value)).catch(() => {});

const newSalt = () => Array.from(Crypto.getRandomBytes(16), (b) => b.toString(16).padStart(2, '0')).join('');
const hash = (senha, salt) => Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `${salt}:${senha}`);
const publicUser = ({ senha, ...u }) => u;

// Na primeira vez cria a conta de exemplo (tutor do protótipo)
async function loadUsers() {
  let users = await read(K.users, null);
  if (!users) {
    const salt = newSalt();
    const demo = {
      id: 'demo',
      nome: DEMO_ACCOUNT.nome,
      email: DEMO_ACCOUNT.email,
      role: ROLES.tutor,
      bloqueado: false,
      criadoEm: new Date().toISOString(),
      senha: { salt, hash: await hash(DEMO_ACCOUNT.senha, salt) },
    };
    users = [demo];
    await write(K.users, users);
    await write(K.data(demo.id), demoUserData);
  }
  return users;
}

async function requireUser(session, { admin } = {}) {
  const users = await loadUsers();
  const me = users.find((u) => u.id === session?.user?.id);
  if (!me) fail('unauthorized', 'Sua sessão expirou. Entre de novo.');
  if (me.bloqueado) fail('blocked', 'Esta conta está bloqueada. Fale com o administrador.');
  if (admin && me.role !== ROLES.admin) fail('forbidden', 'Apenas administradores.');
  return { users, me };
}

export const mode = 'local';

export async function restoreSession(saved) {
  if (!saved?.user?.id) return null;
  const users = await loadUsers();
  const me = users.find((u) => u.id === saved.user.id);
  return me && !me.bloqueado ? { user: publicUser(me) } : null;
}

export async function register({ nome, email, senha, petNome }) {
  const erro = validateSignup({ nome, email, senha });
  if (erro) fail('invalid', erro);
  const users = await loadUsers();
  const e = normEmail(email);
  if (users.some((u) => u.email === e)) fail('email_taken', 'Já existe uma conta com este e-mail.');
  const salt = newSalt();
  const semAdmin = !users.some((u) => u.role === ROLES.admin);
  const user = {
    id: newId(),
    nome: nome.trim(),
    email: e,
    role: semAdmin ? ROLES.admin : ROLES.tutor, // a primeira conta criada vira administradora
    bloqueado: false,
    criadoEm: new Date().toISOString(),
    senha: { salt, hash: await hash(senha, salt) },
  };
  await write(K.users, [...users, user]);
  await write(K.data(user.id), newUserData({ nome: user.nome, email: e, petNome: (petNome || '').trim() }));
  return { user: publicUser(user) };
}

export async function login({ email, senha }) {
  const users = await loadUsers();
  const u = users.find((x) => x.email === normEmail(email));
  if (!u || (await hash(senha || '', u.senha.salt)) !== u.senha.hash) fail('bad_login', 'E-mail ou senha incorretos.');
  if (u.bloqueado) fail('blocked', 'Esta conta está bloqueada. Fale com o administrador.');
  return { user: publicUser(u) };
}

export async function logout() {}

export async function loadData(session) {
  await requireUser(session);
  return read(K.data(session.user.id), null);
}

export async function saveData(session, data) {
  await write(K.data(session.user.id), data);
}

export const loadGlobal = () => read(K.global, initialGlobal);

export async function addAdocao(session, item) {
  await requireUser(session);
  const g = await loadGlobal();
  const novo = { ...g, adocao: [{ ...item, id: newId(), autor: session.user.id }, ...g.adocao] };
  await write(K.global, novo);
  return novo;
}

export async function removeAdocao(session, id) {
  const { me } = await requireUser(session);
  const g = await loadGlobal();
  const item = g.adocao.find((a) => a.id === id);
  if (item && me.role !== ROLES.admin && item.autor !== me.id) fail('forbidden', 'Só quem divulgou ou o administrador pode remover.');
  const novo = { ...g, adocao: g.adocao.filter((a) => a.id !== id) };
  await write(K.global, novo);
  return novo;
}

export async function saveNoticias(session, noticias) {
  await requireUser(session, { admin: true });
  const novo = { ...(await loadGlobal()), noticias };
  await write(K.global, novo);
  return novo;
}

/* ---- administrador ---- */

export async function listUsers(session) {
  const { users } = await requireUser(session, { admin: true });
  const summaries = await Promise.all(users.map(async (u) => summarizeUser(u, await read(K.data(u.id), null))));
  return { users: summaries, stats: computeStats(summaries, await loadGlobal()) };
}

export async function getUserData(session, id) {
  await requireUser(session, { admin: true });
  return read(K.data(id), null);
}

export async function updateUser(session, id, patch) {
  const { users, me } = await requireUser(session, { admin: true });
  const erro = checkAdminChange(users, me.id, id, patch);
  if (erro) fail('invalid', erro);
  const clean = {};
  if (patch.role) clean.role = patch.role;
  if (typeof patch.bloqueado === 'boolean') clean.bloqueado = patch.bloqueado;
  await write(K.users, users.map((u) => (u.id === id ? { ...u, ...clean } : u)));
}

export async function deleteUser(session, id) {
  const { users, me } = await requireUser(session, { admin: true });
  const erro = checkAdminChange(users, me.id, id, { delete: true });
  if (erro) fail('invalid', erro);
  await write(K.users, users.filter((u) => u.id !== id));
  await AsyncStorage.removeItem(K.data(id)).catch(() => {});
}

// Gera uma senha provisória para a conta (o administrador repassa ao tutor)
export async function resetPassword(session, id) {
  const { users } = await requireUser(session, { admin: true });
  if (!users.some((u) => u.id === id)) fail('invalid', 'Conta não encontrada.');
  const senha = tempPassword();
  const salt = newSalt();
  const h = await hash(senha, salt);
  await write(K.users, users.map((u) => (u.id === id ? { ...u, senha: { salt, hash: h } } : u)));
  return { senha };
}
