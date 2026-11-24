import { useState } from 'react';
import { View, Text, ScrollView, TextInput, Pressable, Image, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Gradient from '../components/Gradient';
import Header from '../components/Header';
import { ClipboardIcon, AlertIcon, LockIcon, HeartIcon } from '../components/Icons';
import { consultas, noticias, adocao, pet } from '../data';
import { colors, fonts, shadow } from '../theme';

function Page({ title, onBack, children, id }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.root}>
      <Gradient id={id} from={colors.pink} to={colors.white} />
      <Header title={title} onBack={onBack} />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}>{children}</ScrollView>
    </View>
  );
}

function Card({ Icon, title, children }) {
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
    </View>
  );
}

export function ConsultasScreen({ onBack }) {
  return (
    <Page id="cons" title="Consultas" onBack={onBack}>
      {consultas.map((c) => (
        <Card key={c.data + c.tipo} Icon={ClipboardIcon} title={c.tipo}>
          <Text style={styles.cardText}>{c.data} · {c.local}</Text>
          <Text style={[styles.badge, c.status === 'Agendada' && styles.badgeNext]}>{c.status}</Text>
        </Card>
      ))}
    </Page>
  );
}

export function NoticiasScreen({ onBack }) {
  return (
    <Page id="not" title="Notícias" onBack={onBack}>
      {noticias.map((n) => (
        <Card key={n.titulo} Icon={AlertIcon} title={n.titulo}>
          <Text style={styles.cardText}>{n.texto}</Text>
        </Card>
      ))}
    </Page>
  );
}

export function CodigoScreen({ onBack }) {
  const [codigo, setCodigo] = useState(gerar());
  return (
    <Page id="cod" title="Código de acesso" onBack={onBack}>
      <Card Icon={LockIcon} title={`Código do RGA de ${pet.rga[0][1]}`}>
        <Text style={styles.cardText}>
          Compartilhe este código com o veterinário para ele acessar a ficha do seu pet.
        </Text>
      </Card>
      <Text style={styles.code}>{codigo}</Text>
      <Pressable style={styles.button} onPress={() => setCodigo(gerar())}>
        <Text style={styles.buttonText}>Gerar novo código</Text>
      </Pressable>
    </Page>
  );
}

function gerar() {
  return String(Math.floor(100000 + Math.random() * 900000)).replace(/(\d{3})(\d{3})/, '$1 $2');
}

export function AdocaoScreen({ onBack }) {
  return (
    <Page id="ado" title="Adoção" onBack={onBack}>
      {adocao.map((a) => (
        <Card key={a.nome} Icon={HeartIcon} title={a.nome}>
          <Text style={styles.cardText}>{a.info}</Text>
        </Card>
      ))}
    </Page>
  );
}

export function AjudaScreen({ onBack }) {
  const insets = useSafeAreaInsets();
  const [msgs, setMsgs] = useState([{ de: 'bot', texto: 'Oi! Eu sou o assistente do RGA. Como posso ajudar?' }]);
  const [texto, setTexto] = useState('');

  const enviar = () => {
    const t = texto.trim();
    if (!t) return;
    setMsgs((m) => [
      ...m,
      { de: 'eu', texto: t },
      { de: 'bot', texto: 'Recebi sua mensagem! Em breve um atendente vai responder por aqui.' },
    ]);
    setTexto('');
  };

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Gradient id="aju" from={colors.pink} to={colors.white} />
      <Header title="Posso ajudar?" onBack={onBack} />
      <ScrollView contentContainerStyle={styles.content}>
        {msgs.map((m, i) => (
          <View key={i} style={[styles.msgRow, m.de === 'eu' && { justifyContent: 'flex-end' }]}>
            {m.de === 'bot' && <Image source={require('../../assets/mascote.jpg')} style={styles.avatar} />}
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
        />
        <Pressable style={styles.send} onPress={enviar}>
          <Text style={styles.buttonText}>Enviar</Text>
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
  badge: {
    alignSelf: 'flex-start',
    marginTop: 6,
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    color: colors.white,
    backgroundColor: colors.navy,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: 'hidden',
  },
  badgeNext: { backgroundColor: colors.value },
  code: {
    fontFamily: fonts.titleBold,
    fontSize: 48,
    letterSpacing: 6,
    color: colors.value,
    textAlign: 'center',
    marginVertical: 12,
  },
  button: {
    alignSelf: 'center',
    backgroundColor: colors.white,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 28,
    ...shadow,
  },
  buttonText: { fontFamily: fonts.bodyMedium, fontSize: 14, color: colors.navy },
  msgRow: { flexDirection: 'row', alignItems: 'flex-end' },
  avatar: { width: 36, height: 36, borderRadius: 18, borderWidth: 2, borderColor: colors.mint, marginRight: 8 },
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
});
