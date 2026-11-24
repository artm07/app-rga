// Regras e resumos usados tanto no app (modo local) quanto no servidor (server/).

export const ROLES = { admin: 'admin', tutor: 'tutor' };

export const normEmail = (email) => String(email || '').trim().toLowerCase();

// Valida o cadastro. Retorna uma mensagem de erro ou null.
export function validateSignup({ nome, email, senha }) {
  if (!String(nome || '').trim() || String(nome).trim().length < 2) return 'Informe seu nome.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normEmail(email))) return 'Informe um e-mail válido.';
  if (!senha || String(senha).length < 6) return 'A senha precisa ter pelo menos 6 caracteres.';
  return null;
}

// "dd/mm/aaaa" -> Date (ou null)
const parseData = (s) => {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(s || '');
  return m ? new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1])) : null;
};

// Resumo de uma conta para a lista do administrador
export function summarizeUser(user, data) {
  const hoje = new Date();
  const pet = data?.pet || {};
  const vacinas = pet.vacinas || [];
  return {
    id: user.id,
    nome: user.nome,
    email: user.email,
    role: user.role,
    bloqueado: !!user.bloqueado,
    criadoEm: user.criadoEm,
    pet: {
      nome: pet.nome || '',
      especie: pet.especie || '',
      raca: pet.raca || '',
      idade: pet.idade || '',
      registro: pet.registro || '',
    },
    vacinas: vacinas.length,
    vacinasVencidas: vacinas.filter((v) => {
      const d = parseData(v.proxima);
      return d && d < hoje;
    }).length,
    consultasAgendadas: (data?.consultas || []).filter((c) => c.status === 'Agendada').length,
    interesses: data?.interesses || [],
  };
}

// Números do painel do administrador
export function computeStats(summaries, global) {
  const porEspecie = {};
  for (const s of summaries) {
    const e = s.pet.especie || 'Não informado';
    porEspecie[e] = (porEspecie[e] || 0) + 1;
  }
  return {
    contas: summaries.length,
    admins: summaries.filter((s) => s.role === ROLES.admin).length,
    bloqueadas: summaries.filter((s) => s.bloqueado).length,
    vacinasVencidas: summaries.reduce((n, s) => n + s.vacinasVencidas, 0),
    consultasAgendadas: summaries.reduce((n, s) => n + s.consultasAgendadas, 0),
    porEspecie,
    noticias: global?.noticias?.length || 0,
    adocao: global?.adocao?.length || 0,
  };
}

// Regras de alteração de conta pelo administrador. Retorna mensagem de erro ou null.
export function checkAdminChange(users, actorId, targetId, patch) {
  const target = users.find((u) => u.id === targetId);
  if (!target) return 'Conta não encontrada.';
  const admins = users.filter((u) => u.role === ROLES.admin && !u.bloqueado);
  const tiraAdmin =
    target.role === ROLES.admin && (patch.delete || patch.bloqueado === true || (patch.role && patch.role !== ROLES.admin));
  if (targetId === actorId && (patch.delete || patch.bloqueado || (patch.role && patch.role !== ROLES.admin)))
    return 'Você não pode excluir, bloquear ou rebaixar a sua própria conta.';
  if (tiraAdmin && admins.length <= 1) return 'É preciso manter pelo menos um administrador.';
  if (patch.role && !Object.values(ROLES).includes(patch.role)) return 'Tipo de conta inválido.';
  return null;
}

// Senha provisória fácil de ditar (sem letras/números que se confundem)
export function tempPassword(n = 8) {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
  let s = '';
  for (let i = 0; i < n; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}
