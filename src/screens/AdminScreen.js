import { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Gradient from '../components/Gradient';
import Header from '../components/Header';
import { Input, Button } from '../components/ui';
import { PlusIcon, TrashIcon, PencilIcon, HeartIcon, AlertIcon } from '../components/Icons';
import { useStore } from '../store';
import { RGA_FIELDS, TUTOR_FIELDS, LOCAL_FIELDS, getPath, newId } from '../data';
import { colors, fonts, shadow } from '../theme';

const TABS = ['Resumo', 'Contas', 'Notícias', 'Adoção'];

const fmtData = (iso) => {
  try {
    return new Date(iso).toLocaleDateString('pt-BR');
  } catch {
    return '';
  }
};

export default function AdminScreen({ onBack }) {
  const insets = useSafeAreaInsets();
  const store = useStore();
  const { session, backend } = store;
  const [tab, setTab] = useState('Resumo');
  const [lista, setLista] = useState(null); // { users, stats }
  const [erro, setErro] = useState('');

  const carregar = useCallback(async () => {
    try {
      setLista(await backend.listUsers(session));
      setErro('');
    } catch (e) {
      setErro(e?.message || 'Não foi possível carregar as contas.');
    }
  }, [backend, session]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  return (
    <View style={styles.root}>
      <Gradient id="adm" from={colors.pink} to={colors.white} />
      <Header title="Administração" onBack={onBack} />
      {backend.mode === 'local' && (
        <Text style={styles.modo}>Modo demonstração: aqui aparecem só as contas criadas neste aparelho.</Text>
      )}
      <View style={styles.tabs}>
        {TABS.map((t) => (
          <Pressable key={t} onPress={() => setTab(t)} style={[styles.tab, tab === t && styles.tabOn]}>
            <Text style={[styles.tabText, tab === t && styles.tabTextOn]}>{t}</Text>
          </Pressable>
        ))}
      </View>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]} keyboardShouldPersistTaps="handled">
        {erro ? <Text style={styles.erro}>{erro}</Text> : null}
        {!lista && !erro ? <ActivityIndicator color={colors.navy} style={{ marginTop: 30 }} /> : null}
        {lista && tab === 'Resumo' && <Resumo stats={lista.stats} />}
        {lista && tab === 'Contas' && <Contas users={lista.users} onChange={carregar} />}
        {tab === 'Notícias' && <Noticias onChange={carregar} />}
        {lista && tab === 'Adoção' && <Adocao users={lista.users} onChange={carregar} />}
      </ScrollView>
    </View>
  );
}

/* ---------- Resumo ---------- */

function Stat({ valor, label, alerta }) {
  return (
    <View style={[styles.stat, alerta && valor > 0 && styles.statAlerta]}>
      <Text style={[styles.statValor, alerta && valor > 0 && { color: colors.value }]}>{valor}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function Resumo({ stats }) {
  const especies = Object.entries(stats.porEspecie).sort((a, b) => b[1] - a[1]);
  const max = Math.max(1, ...especies.map(([, n]) => n));
  return (
    <>
      <View style={styles.stats}>
        <Stat valor={stats.contas} label="Contas" />
        <Stat valor={stats.admins} label="Admins" />
        <Stat valor={stats.bloqueadas} label="Bloqueadas" alerta />
        <Stat valor={stats.vacinasVencidas} label="Vacinas vencidas" alerta />
        <Stat valor={stats.consultasAgendadas} label="Consultas agendadas" />
        <Stat valor={stats.adocao} label="Animais p/ adoção" />
      </View>
      <View style={styles.box}>
        <Text style={styles.boxTitle}>Pets por espécie</Text>
        {especies.map(([nome, n]) => (
          <View key={nome} style={styles.barRow}>
            <Text style={styles.barLabel}>{nome}</Text>
            <View style={styles.barTrack}>
              <View style={[styles.bar, { width: `${(n / max) * 100}%` }]} />
            </View>
            <Text style={styles.barNum}>{n}</Text>
          </View>
        ))}
      </View>
    </>
  );
}

/* ---------- Contas ---------- */

function Contas({ users, onChange }) {
  const { session, backend } = useStore();
  const [busca, setBusca] = useState('');
  const [aberta, setAberta] = useState(null); // id da conta com ações abertas
  const [ficha, setFicha] = useState(null); // { user, data }
  const [confirmar, setConfirmar] = useState(null); // id aguardando confirmação de exclusão
  const [msg, setMsg] = useState(null); // { id, texto, erro }

  const filtradas = useMemo(() => {
    const q = busca.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => [u.nome, u.email, u.pet.nome, u.pet.registro].some((v) => (v || '').toLowerCase().includes(q)));
  }, [users, busca]);

  const acao = async (u, fn, sucesso) => {
    try {
      const r = await fn();
      setMsg({ id: u.id, texto: typeof sucesso === 'function' ? sucesso(r) : sucesso });
      setConfirmar(null);
      await onChange();
    } catch (e) {
      setMsg({ id: u.id, texto: e?.message || 'Não foi possível concluir.', erro: true });
    }
  };

  if (ficha) return <Ficha {...ficha} onClose={() => setFicha(null)} />;

  return (
    <>
      <TextInput
        style={styles.busca}
        value={busca}
        onChangeText={setBusca}
        placeholder="Buscar por nome, e-mail, pet ou nº do RGA"
        placeholderTextColor="#8A90A6"
      />
      <Text style={styles.count}>
        {filtradas.length} de {users.length} contas
      </Text>
      {filtradas.map((u) => {
        const eu = u.id === session.user.id;
        const open = aberta === u.id;
        return (
          <View key={u.id} style={[styles.conta, u.bloqueado && { opacity: 0.7 }]}>
            <Pressable onPress={() => (setAberta(open ? null : u.id), setMsg(null), setConfirmar(null))}>
              <View style={styles.contaTop}>
                <Text style={styles.contaNome}>
                  {u.nome}
                  {eu ? ' (você)' : ''}
                </Text>
                <View style={{ flexDirection: 'row', gap: 4 }}>
                  {u.role === 'admin' && <Text style={[styles.tag, styles.tagAdmin]}>Admin</Text>}
                  {u.bloqueado && <Text style={[styles.tag, styles.tagBloq]}>Bloqueada</Text>}
                </View>
              </View>
              <Text style={styles.contaEmail}>{u.email}</Text>
              <Text style={styles.contaPet}>
                🐾 {u.pet.nome || 'Pet sem nome'}
                {u.pet.especie ? ` · ${u.pet.especie}` : ''}
                {u.pet.raca ? ` · ${u.pet.raca}` : ''}
              </Text>
              <Text style={styles.contaInfo}>
                {u.vacinas} vacina{u.vacinas === 1 ? '' : 's'}
                {u.vacinasVencidas ? ` (${u.vacinasVencidas} vencida${u.vacinasVencidas === 1 ? '' : 's'})` : ''} ·{' '}
                {u.consultasAgendadas} consulta{u.consultasAgendadas === 1 ? '' : 's'} agendada
                {u.consultasAgendadas === 1 ? '' : 's'} · desde {fmtData(u.criadoEm)}
              </Text>
            </Pressable>

            {open && (
              <View style={styles.acoes}>
                <Button
                  title="Ver ficha"
                  variant="light"
                  onPress={async () => {
                    try {
                      setFicha({ user: u, data: await backend.getUserData(session, u.id) });
                    } catch (e) {
                      setMsg({ id: u.id, texto: e?.message, erro: true });
                    }
                  }}
                />
                {!eu && (
                  <>
                    <Button
                      title={u.role === 'admin' ? 'Remover admin' : 'Tornar admin'}
                      variant="mint"
                      onPress={() =>
                        acao(
                          u,
                          () => backend.updateUser(session, u.id, { role: u.role === 'admin' ? 'tutor' : 'admin' }),
                          u.role === 'admin' ? 'Agora é tutor.' : 'Agora é administrador.'
                        )
                      }
                    />
                    <Button
                      title={u.bloqueado ? 'Desbloquear' : 'Bloquear'}
                      variant="mint"
                      onPress={() =>
                        acao(u, () => backend.updateUser(session, u.id, { bloqueado: !u.bloqueado }), u.bloqueado ? 'Conta desbloqueada.' : 'Conta bloqueada: não consegue mais entrar.')
                      }
                    />
                  </>
                )}
                <Button
                  title="Redefinir senha"
                  variant="mint"
                  onPress={() => acao(u, () => backend.resetPassword(session, u.id), (r) => `Senha provisória: ${r.senha}  (passe para o tutor; ele pode entrar com ela)`)}
                />
                {!eu &&
                  (confirmar === u.id ? (
                    <View style={styles.confirma}>
                      <Text style={styles.confirmaText}>Excluir {u.nome} e todos os dados do pet?</Text>
                      <View style={{ flexDirection: 'row', gap: 8 }}>
                        <Button title="Cancelar" variant="ghost" onPress={() => setConfirmar(null)} />
                        <Button title="Excluir" variant="primary" style={{ backgroundColor: colors.value }} onPress={() => acao(u, () => backend.deleteUser(session, u.id), 'Conta excluída.')} />
                      </View>
                    </View>
                  ) : (
                    <Button title="Excluir conta" variant="danger" icon={<TrashIcon color={colors.value} />} onPress={() => setConfirmar(u.id)} />
                  ))}
              </View>
            )}
            {msg?.id === u.id && <Text selectable style={[styles.msg, msg.erro && { color: colors.value }]}>{msg.texto}</Text>}
          </View>
        );
      })}
    </>
  );
}

// Ficha do pet de uma conta (somente leitura)
function Ficha({ user, data, onClose }) {
  const pet = data?.pet;
  const secao = (titulo, campos) => (
    <View style={styles.box}>
      <Text style={styles.boxTitle}>{titulo}</Text>
      {campos.map((f) => (
        <View key={f.path} style={styles.fichaRow}>
          <Text style={styles.fichaLabel}>{f.label}:</Text>
          <Text style={styles.fichaValor}>{getPath(pet, f.path) || '—'}</Text>
        </View>
      ))}
    </View>
  );
  return (
    <>
      <Button title="← Voltar para as contas" variant="ghost" onPress={onClose} style={{ alignSelf: 'flex-start', paddingHorizontal: 0 }} />
      <Text style={styles.fichaTitulo}>
        {pet?.nome || 'Pet sem nome'} · RGA {pet?.registro}
      </Text>
      <Text style={styles.contaEmail}>Conta de {user.nome} ({user.email})</Text>
      {!pet ? (
        <Text style={styles.empty}>Esta conta ainda não tem dados.</Text>
      ) : (
        <>
          {secao('RGA', RGA_FIELDS)}
          {secao('Tutor', TUTOR_FIELDS)}
          {secao('Localização', LOCAL_FIELDS)}
          <View style={styles.box}>
            <Text style={styles.boxTitle}>Vacinas</Text>
            {pet.vacinas.length === 0 && <Text style={styles.fichaValor}>Nenhuma registrada.</Text>}
            {pet.vacinas.map((v) => (
              <Text key={v.id} style={styles.fichaValor}>
                {v.nome} — aplicada {v.data}
                {v.proxima ? `, próxima ${v.proxima}` : ''}
              </Text>
            ))}
          </View>
          <View style={styles.box}>
            <Text style={styles.boxTitle}>Consultas</Text>
            {(data.consultas || []).length === 0 && <Text style={styles.fichaValor}>Nenhuma registrada.</Text>}
            {(data.consultas || []).map((c) => (
              <Text key={c.id} style={styles.fichaValor}>
                {c.data} — {c.tipo} ({c.status})
              </Text>
            ))}
          </View>
        </>
      )}
    </>
  );
}

/* ---------- Notícias ---------- */

function Noticias({ onChange }) {
  const { global, setGlobal, session, backend } = useStore();
  const [form, setForm] = useState(null); // { id?, titulo, texto }
  const [erro, setErro] = useState('');

  const salvarLista = async (lista) => {
    try {
      setGlobal(await backend.saveNoticias(session, lista));
      setErro('');
      onChange();
      return true;
    } catch (e) {
      setErro(e?.message || 'Não foi possível salvar.');
      return false;
    }
  };

  const salvar = async () => {
    if (!form.titulo.trim() || !form.texto.trim()) return setErro('Preencha o título e o texto.');
    const item = { id: form.id || newId(), titulo: form.titulo.trim(), texto: form.texto.trim() };
    const lista = form.id ? global.noticias.map((n) => (n.id === form.id ? item : n)) : [item, ...global.noticias];
    if (await salvarLista(lista)) setForm(null);
  };

  return (
    <>
      {form ? (
        <View style={styles.box}>
          <Text style={styles.boxTitle}>{form.id ? 'Editar notícia' : 'Nova notícia'}</Text>
          <Input label="Título" value={form.titulo} onChangeText={(t) => setForm({ ...form, titulo: t })} autoFocus />
          <Input label="Texto" value={form.texto} onChangeText={(t) => setForm({ ...form, texto: t })} multiline />
          {erro ? <Text style={styles.erro}>{erro}</Text> : null}
          <View style={styles.rowEnd}>
            <Button title="Cancelar" variant="ghost" onPress={() => (setForm(null), setErro(''))} />
            <Button title="Publicar" onPress={salvar} />
          </View>
        </View>
      ) : (
        <Button title="Nova notícia" variant="light" icon={<PlusIcon />} onPress={() => setForm({ titulo: '', texto: '' })} />
      )}
      {!form && erro ? <Text style={styles.erro}>{erro}</Text> : null}
      <Text style={styles.count}>Todas as contas veem estas notícias na tela Notícias.</Text>
      {global.noticias.map((n) => (
        <View key={n.id} style={styles.item}>
          <AlertIcon size={22} />
          <View style={{ flex: 1 }}>
            <Text style={styles.itemTitulo}>{n.titulo}</Text>
            <Text style={styles.itemTexto}>{n.texto}</Text>
          </View>
          <Pressable onPress={() => setForm(n)} hitSlop={8} accessibilityLabel={`Editar ${n.titulo}`}>
            <PencilIcon size={18} />
          </Pressable>
          <Pressable onPress={() => salvarLista(global.noticias.filter((x) => x.id !== n.id))} hitSlop={8} accessibilityLabel={`Remover ${n.titulo}`}>
            <TrashIcon color={colors.value} />
          </Pressable>
        </View>
      ))}
    </>
  );
}

/* ---------- Adoção ---------- */

function Adocao({ users, onChange }) {
  const { global, setGlobal, session, backend } = useStore();
  const [erro, setErro] = useState('');
  const nomes = Object.fromEntries(users.map((u) => [u.id, u.nome]));

  const remover = async (id) => {
    try {
      setGlobal(await backend.removeAdocao(session, id));
      setErro('');
      onChange();
    } catch (e) {
      setErro(e?.message || 'Não foi possível remover.');
    }
  };

  return (
    <>
      {erro ? <Text style={styles.erro}>{erro}</Text> : null}
      <Text style={styles.count}>Animais divulgados pelos tutores e quem marcou "Quero adotar".</Text>
      {global.adocao.length === 0 && <Text style={styles.empty}>Nenhum animal para adoção.</Text>}
      {global.adocao.map((a) => {
        const interessados = users.filter((u) => u.interesses.includes(a.id));
        return (
          <View key={a.id} style={styles.item}>
            <HeartIcon size={22} />
            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitulo}>{a.nome}</Text>
              {a.info ? <Text style={styles.itemTexto}>{a.info}</Text> : null}
              <Text style={styles.itemMeta}>Divulgado por: {a.autor ? nomes[a.autor] || 'conta excluída' : 'RGA'}</Text>
              <Text style={styles.itemMeta}>
                Interessados ({interessados.length}): {interessados.map((u) => `${u.nome} <${u.email}>`).join(', ') || '—'}
              </Text>
            </View>
            <Pressable onPress={() => remover(a.id)} hitSlop={8} accessibilityLabel={`Remover ${a.nome}`}>
              <TrashIcon color={colors.value} />
            </Pressable>
          </View>
        );
      })}
    </>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  modo: { fontFamily: fonts.body, fontSize: 11, color: colors.navy, opacity: 0.8, paddingHorizontal: 20, marginBottom: 6 },
  tabs: { flexDirection: 'row', backgroundColor: colors.mint, padding: 4, marginHorizontal: 16, borderRadius: 16, gap: 4 },
  tab: { flex: 1, paddingVertical: 8, borderRadius: 12, alignItems: 'center' },
  tabOn: { backgroundColor: colors.white },
  tabText: { fontFamily: fonts.bodyItalic, fontSize: 13, color: colors.navy },
  tabTextOn: { fontFamily: fonts.bodyBoldItalic },
  content: { padding: 16, gap: 12 },
  erro: { fontFamily: fonts.bodyMedium, fontSize: 12, color: colors.value },
  empty: { fontFamily: fonts.body, fontSize: 14, color: colors.navy, textAlign: 'center' },
  count: { fontFamily: fonts.body, fontSize: 12, color: colors.navy, opacity: 0.8 },
  stats: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  stat: {
    flexBasis: '30%',
    flexGrow: 1,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 12,
    borderWidth: 2,
    borderColor: colors.mint,
  },
  statAlerta: { borderColor: colors.value },
  statValor: { fontFamily: fonts.titleBold, fontSize: 26, color: colors.navy },
  statLabel: { fontFamily: fonts.body, fontSize: 11, color: colors.navy },
  box: { backgroundColor: colors.pinkLight, borderRadius: 16, padding: 14, gap: 8, borderWidth: 2, borderColor: colors.mint },
  boxTitle: { fontFamily: fonts.titleBold, fontSize: 16, color: colors.navy },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  barLabel: { width: 96, fontFamily: fonts.body, fontSize: 12, color: colors.navy },
  barTrack: { flex: 1, height: 12, backgroundColor: colors.white, borderRadius: 6, overflow: 'hidden' },
  bar: { height: '100%', backgroundColor: colors.mintDark, borderRadius: 6 },
  barNum: { width: 24, textAlign: 'right', fontFamily: fonts.bodyMedium, fontSize: 12, color: colors.navy },
  busca: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.navy,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.mint,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 9,
    outlineStyle: 'none',
  },
  conta: { backgroundColor: colors.white, borderRadius: 16, padding: 14, ...shadow, shadowOpacity: 0.15 },
  contaTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  contaNome: { flexShrink: 1, fontFamily: fonts.titleBold, fontSize: 17, color: colors.navy },
  contaEmail: { fontFamily: fonts.body, fontSize: 12, color: colors.navy, opacity: 0.85 },
  contaPet: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.value, marginTop: 4 },
  contaInfo: { fontFamily: fonts.body, fontSize: 11, color: colors.navy, marginTop: 2 },
  tag: {
    fontFamily: fonts.bodyMedium,
    fontSize: 10,
    color: colors.white,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    overflow: 'hidden',
  },
  tagAdmin: { backgroundColor: colors.navy },
  tagBloq: { backgroundColor: colors.value },
  acoes: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  confirma: { width: '100%', backgroundColor: colors.pinkLight, borderRadius: 12, padding: 10, gap: 6 },
  confirmaText: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.value },
  msg: { fontFamily: fonts.bodyMedium, fontSize: 12, color: colors.navy, marginTop: 8 },
  fichaTitulo: { fontFamily: fonts.titleBold, fontSize: 20, color: colors.navy },
  fichaRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'baseline', gap: 6 },
  fichaLabel: { fontFamily: fonts.body, fontSize: 13, color: colors.navy },
  fichaValor: { fontFamily: fonts.body, fontSize: 14, color: colors.value },
  rowEnd: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8 },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 14,
    borderLeftWidth: 6,
    borderLeftColor: colors.mint,
  },
  itemTitulo: { fontFamily: fonts.titleBold, fontSize: 15, color: colors.navy },
  itemTexto: { fontFamily: fonts.body, fontSize: 13, color: colors.navy },
  itemMeta: { fontFamily: fonts.body, fontSize: 11, color: colors.navy, opacity: 0.85, marginTop: 2 },
});
