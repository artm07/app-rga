import { useRef, useState } from 'react';
import { View, Text, ScrollView, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';
import Gradient from '../components/Gradient';
import Header from '../components/Header';
import Mascot from '../components/Mascot';
import { ClipboardIcon, AlertIcon, LockIcon, HeartIcon, PlusIcon, TrashIcon } from '../components/Icons';
import { Input, Choice, Button } from '../components/ui';
import { useStore } from '../store';
import { newId } from '../data';
import { colors, fonts, shadow } from '../theme';

function Page({ title, onBack, children, id }) {
  const insets = useSafeAreaInsets();
  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Gradient id={id} from={colors.pink} to={colors.white} />
      <Header title={title} onBack={onBack} />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Card({ Icon, title, children, right }) {
  return (
    <View style={styles.card}>
      {Icon && (
        <View style={styles.iconCircle}>
          <Icon size={28} />
        </View>
      )}
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>{title}</Text>
        {children}
      </View>
      {right}
    </View>
  );
}

function RemoveButton({ onPress, label }) {
  return (
    <Pressable onPress={onPress} hitSlop={10} style={styles.remove} accessibilityLabel={label}>
      <TrashIcon color={colors.navy} />
    </Pressable>
  );
}

function FormBox({ children }) {
  return <View style={styles.formBox}>{children}</View>;
}

/* ---------- Consultas ---------- */

const STATUS = ['Agendada', 'Realizada', 'Cancelada'];

export function ConsultasScreen({ onBack }) {
  const { data, update } = useStore();
  const [form, setForm] = useState(null);
  const [erro, setErro] = useState('');
  const set = (fn) => update((d) => ({ ...d, consultas: fn(d.consultas) }));

  const salvar = () => {
    if (!form.tipo.trim() || form.data.length !== 10) {
      setErro('Informe o motivo da consulta e a data (dd/mm/aaaa).');
      return;
    }
    set((l) => [{ id: newId(), ...form, tipo: form.tipo.trim(), local: form.local.trim() }, ...l]);
    setForm(null);
    setErro('');
  };

  return (
    <Page id="cons" title="Consultas" onBack={onBack}>
      {form ? (
        <FormBox>
          <Input label="Motivo" placeholder="Ex.: Vacinação, check-up..." value={form.tipo} onChangeText={(t) => setForm({ ...form, tipo: t })} autoFocus />
          <Input label="Data" placeholder="dd/mm/aaaa" mask="date" value={form.data} onChangeText={(t) => setForm({ ...form, data: t })} />
          <Input label="Clínica / local" value={form.local} onChangeText={(t) => setForm({ ...form, local: t })} />
          <Choice label="Situação" options={STATUS} value={form.status} onChange={(s) => setForm({ ...form, status: s })} />
          {erro ? <Text style={styles.erro}>{erro}</Text> : null}
          <View style={styles.actions}>
            <Button title="Cancelar" variant="ghost" onPress={() => (setForm(null), setErro(''))} />
            <Button title="Salvar consulta" onPress={salvar} />
          </View>
        </FormBox>
      ) : (
        <Button
          title="Nova consulta"
          variant="light"
          icon={<PlusIcon />}
          onPress={() => setForm({ tipo: '', data: '', local: '', status: 'Agendada' })}
        />
      )}

      {data.consultas.length === 0 && <Text style={styles.empty}>Nenhuma consulta cadastrada.</Text>}
      {data.consultas.map((c) => (
        <Card
          key={c.id}
          Icon={ClipboardIcon}
          title={c.tipo}
          right={<RemoveButton label={`Remover ${c.tipo}`} onPress={() => set((l) => l.filter((x) => x.id !== c.id))} />}
        >
          <Text style={styles.cardText}>{[c.data, c.local].filter(Boolean).join(' · ')}</Text>
          <Pressable
            onPress={() =>
              set((l) =>
                l.map((x) => (x.id === c.id ? { ...x, status: STATUS[(STATUS.indexOf(x.status) + 1) % STATUS.length] } : x))
              )
            }
            accessibilityLabel="Mudar situação"
          >
            <Text style={[styles.badge, styles[`badge${c.status}`]]}>{c.status} ⟳</Text>
          </Pressable>
        </Card>
      ))}
    </Page>
  );
}

/* ---------- Notícias ---------- */

export function NoticiasScreen({ onBack }) {
  const { data } = useStore();
  return (
    <Page id="not" title="Notícias" onBack={onBack}>
      {data.noticias.map((n) => (
        <Card key={n.id} Icon={AlertIcon} title={n.titulo}>
          <Text style={styles.cardText}>{n.texto}</Text>
        </Card>
      ))}
    </Page>
  );
}

/* ---------- Código de acesso ---------- */

const gerar = () => String(Math.floor(100000 + Math.random() * 900000)).replace(/(\d{3})(\d{3})/, '$1 $2');

export function CodigoScreen({ onBack }) {
  const { data, update } = useStore();
  const [copiado, setCopiado] = useState(false);

  const copiar = async () => {
    try {
      await Clipboard.setStringAsync(data.codigo.replace(' ', ''));
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      setCopiado(false);
    }
  };

  return (
    <Page id="cod" title="Código de acesso" onBack={onBack}>
      <Card Icon={LockIcon} title={`Código do RGA de ${data.pet.nome}`}>
        <Text style={styles.cardText}>
          Passe este código para o veterinário acessar a ficha do seu pet. Gere um novo quando quiser cancelar o anterior.
        </Text>
      </Card>
      <Text selectable style={styles.code}>{data.codigo}</Text>
      <View style={[styles.actions, { justifyContent: 'center' }]}>
        <Button title={copiado ? 'Copiado!' : 'Copiar'} variant="mint" onPress={copiar} />
        <Button title="Gerar novo código" variant="light" onPress={() => update((d) => ({ ...d, codigo: gerar() }))} />
      </View>
    </Page>
  );
}

/* ---------- Adoção ---------- */

export function AdocaoScreen({ onBack }) {
  const { data, update } = useStore();
  const [form, setForm] = useState(null);
  const [erro, setErro] = useState('');
  const set = (fn) => update((d) => ({ ...d, adocao: fn(d.adocao) }));

  const salvar = () => {
    if (!form.nome.trim()) {
      setErro('Informe o nome do animal.');
      return;
    }
    set((l) => [{ id: newId(), nome: form.nome.trim(), info: form.info.trim(), interesse: false }, ...l]);
    setForm(null);
    setErro('');
  };

  return (
    <Page id="ado" title="Adoção" onBack={onBack}>
      {form ? (
        <FormBox>
          <Input label="Nome do animal" value={form.nome} onChangeText={(t) => setForm({ ...form, nome: t })} autoFocus />
          <Input
            label="Descrição"
            placeholder="Ex.: Gato · 2 anos · Castrado"
            value={form.info}
            onChangeText={(t) => setForm({ ...form, info: t })}
          />
          {erro ? <Text style={styles.erro}>{erro}</Text> : null}
          <View style={styles.actions}>
            <Button title="Cancelar" variant="ghost" onPress={() => (setForm(null), setErro(''))} />
            <Button title="Divulgar" onPress={salvar} />
          </View>
        </FormBox>
      ) : (
        <Button title="Divulgar animal para adoção" variant="light" icon={<PlusIcon />} onPress={() => setForm({ nome: '', info: '' })} />
      )}

      {data.adocao.map((a) => (
        <Card
          key={a.id}
          Icon={HeartIcon}
          title={a.nome}
          right={<RemoveButton label={`Remover ${a.nome}`} onPress={() => set((l) => l.filter((x) => x.id !== a.id))} />}
        >
          {a.info ? <Text style={styles.cardText}>{a.info}</Text> : null}
          <Pressable onPress={() => set((l) => l.map((x) => (x.id === a.id ? { ...x, interesse: !x.interesse } : x)))}>
            <Text style={[styles.badge, a.interesse ? styles.badgeAgendada : styles.badgeLight]}>
              {a.interesse ? '♥ Tenho interesse' : '♡ Quero adotar'}
            </Text>
          </Pressable>
        </Card>
      ))}
    </Page>
  );
}

/* ---------- Posso ajudar? (chat) ---------- */

function resposta(texto, data) {
  const t = texto.toLowerCase();
  if (t.includes('vacina')) {
    const v = data.pet.vacinas[data.pet.vacinas.length - 1];
    return v
      ? `A última vacina registrada de ${data.pet.nome} é ${v.nome} (${v.data}). Você pode adicionar outras na aba Vacinação do RGA.`
      : 'Ainda não há vacinas registradas. Adicione na aba Vacinação do RGA.';
  }
  if (t.includes('consulta')) {
    const prox = data.consultas.find((c) => c.status === 'Agendada');
    return prox ? `A próxima consulta agendada é "${prox.tipo}" em ${prox.data}.` : 'Não há consultas agendadas. Crie uma em Consultas.';
  }
  if (t.includes('código') || t.includes('codigo')) return `O código de acesso atual é ${data.codigo}.`;
  if (t.includes('adot')) return 'Veja os animais disponíveis na tela Adoção e toque em "Quero adotar".';
  if (t.includes('editar') || t.includes('mudar') || t.includes('alterar'))
    return 'Na tela RGA, toque em "Editar" no canto superior direito. Para trocar a foto, toque nela.';
  return 'Recebi sua mensagem! Em breve um atendente vai responder por aqui.';
}

export function AjudaScreen({ onBack }) {
  const insets = useSafeAreaInsets();
  const { data, update } = useStore();
  const [texto, setTexto] = useState('');
  const scroll = useRef(null);

  const enviar = () => {
    const t = texto.trim();
    if (!t) return;
    update((d) => ({
      ...d,
      chat: [...d.chat, { id: newId(), de: 'eu', texto: t }, { id: newId(), de: 'bot', texto: resposta(t, d) }],
    }));
    setTexto('');
  };

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Gradient id="aju" from={colors.pink} to={colors.white} />
      <Header title="Posso ajudar?" onBack={onBack} />
      <ScrollView
        ref={scroll}
        contentContainerStyle={styles.content}
        onContentSizeChange={() => scroll.current?.scrollToEnd({ animated: true })}
      >
        {data.chat.map((m) => (
          <View key={m.id} style={[styles.msgRow, m.de === 'eu' && { justifyContent: 'flex-end' }]}>
            {m.de === 'bot' && (
              <View style={styles.avatar}>
                <Mascot size={36} animate={false} />
              </View>
            )}
            <Text style={[styles.bubble, m.de === 'eu' ? styles.bubbleMe : styles.bubbleBot]}>{m.texto}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={[styles.inputRow, { paddingBottom: insets.bottom + 10 }]}>
        <TextInput
          style={styles.input}
          value={texto}
          onChangeText={setTexto}
          placeholder="Digite sua mensagem..."
          placeholderTextColor="#8A90A6"
          onSubmitEditing={enviar}
          returnKeyType="send"
        />
        <Pressable style={styles.send} onPress={enviar}>
          <Text style={styles.sendText}>Enviar</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  content: { padding: 20, gap: 18 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.mint,
    borderRadius: 20,
    padding: 14,
    ...shadow,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  cardTitle: { fontFamily: fonts.titleBold, fontSize: 18, color: colors.navy },
  cardText: { fontFamily: fonts.body, fontSize: 13, color: colors.navy, marginTop: 2 },
  remove: { padding: 6, marginLeft: 6 },
  badge: {
    alignSelf: 'flex-start',
    marginTop: 6,
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    color: colors.white,
    backgroundColor: colors.navy,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    overflow: 'hidden',
  },
  badgeAgendada: { backgroundColor: colors.value },
  badgeRealizada: { backgroundColor: colors.navy },
  badgeCancelada: { backgroundColor: '#9AA0B2' },
  badgeLight: { backgroundColor: colors.white, color: colors.value },
  formBox: {
    backgroundColor: colors.pinkLight,
    borderRadius: 20,
    padding: 16,
    gap: 12,
    borderWidth: 2,
    borderColor: colors.mint,
  },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, flexWrap: 'wrap' },
  erro: { fontFamily: fonts.bodyMedium, fontSize: 12, color: colors.value },
  empty: { fontFamily: fonts.body, fontSize: 14, color: colors.navy, textAlign: 'center' },
  code: {
    fontFamily: fonts.titleBold,
    fontSize: 48,
    letterSpacing: 6,
    color: colors.value,
    textAlign: 'center',
    marginVertical: 12,
  },
  msgRow: { flexDirection: 'row', alignItems: 'flex-end' },
  avatar: { marginRight: 8 },
  bubble: {
    maxWidth: '78%',
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.navy,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    overflow: 'hidden',
  },
  bubbleBot: { backgroundColor: colors.mint, borderBottomLeftRadius: 4 },
  bubbleMe: { backgroundColor: colors.white, borderBottomRightRadius: 4, ...shadow, shadowOpacity: 0.15 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingTop: 10,
    gap: 10,
    backgroundColor: colors.pinkLight,
  },
  input: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.navy,
    backgroundColor: colors.white,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    outlineStyle: 'none',
  },
  send: { backgroundColor: colors.mint, borderRadius: 18, paddingVertical: 10, paddingHorizontal: 16 },
  sendText: { fontFamily: fonts.bodyMedium, fontSize: 14, color: colors.navy },
});
