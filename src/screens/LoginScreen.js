import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Logo from '../components/Logo';
import { colors, fonts, shadow } from '../theme';
import { useStore } from '../store';
import { validateSignup } from '../backend/shared';
import { DEMO_ACCOUNT } from '../data';

function Blobs() {
  return (
    <Svg style={StyleSheet.absoluteFill} viewBox="0 0 100 200" preserveAspectRatio="none">
      <Path d="M0 0 H60 C60 14 52 22 44 24 C34 27 28 30 24 40 C20 50 12 56 0 56 Z" fill={colors.mintSoft} />
      <Path
        d="M100 98 C88 99 80 102 76 112 C72 124 70 140 60 154 C52 166 40 168 32 174 C24 180 20 190 19 200 H100 Z"
        fill={colors.mintSoft}
      />
    </Svg>
  );
}

function Field({ label, style, ...props }) {
  return (
    <View style={style}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={styles.input} placeholderTextColor="#8A90A6" {...props} />
    </View>
  );
}

// Tela de entrada: "Log in" e "Criar conta" no mesmo visual do protótipo
export default function LoginScreen() {
  const { login, register, backend } = useStore();
  const [modo, setModo] = useState('entrar'); // 'entrar' | 'criar'
  const [form, setForm] = useState({ nome: '', email: '', senha: '', confirma: '', petNome: '' });
  const [aviso, setAviso] = useState(null); // { tipo: 'erro' | 'info', texto }
  const [enviando, setEnviando] = useState(false);
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));
  const criando = modo === 'criar';

  const trocarModo = () => {
    setModo(criando ? 'entrar' : 'criar');
    setAviso(null);
  };

  const enviar = async () => {
    if (enviando) return;
    if (!form.email.trim() || !form.senha) return setAviso({ tipo: 'erro', texto: 'Preencha o e-mail e a senha.' });
    if (criando) {
      const erro = validateSignup(form);
      if (erro) return setAviso({ tipo: 'erro', texto: erro });
      if (form.senha !== form.confirma) return setAviso({ tipo: 'erro', texto: 'As senhas não são iguais.' });
    }
    setAviso(null);
    setEnviando(true);
    try {
      if (criando) await register({ nome: form.nome, email: form.email, senha: form.senha, petNome: form.petNome });
      else await login({ email: form.email, senha: form.senha });
    } catch (e) {
      setAviso({ tipo: 'erro', texto: e?.message || 'Não foi possível entrar. Tente de novo.' });
      setEnviando(false);
    }
  };

  const esqueci = () =>
    setAviso({
      tipo: 'info',
      texto: 'Peça ao administrador para redefinir sua senha. Ele gera uma senha provisória para você.',
    });

  return (
    <View style={styles.root}>
      <Blobs />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={[styles.content, criando && { paddingTop: '10%' }]} keyboardShouldPersistTaps="handled">
          <View style={[styles.logo, criando && { marginBottom: 20 }]}>
            <Logo size={criando ? 44 : 58} />
          </View>
          <Text style={[styles.welcome, criando && { marginBottom: 24, fontSize: 26 }]}>
            {criando ? 'Criar conta' : 'Bem-vindo!'}
          </Text>

          <View style={styles.form}>
            {criando && <Field label="Seu nome" value={form.nome} onChangeText={set('nome')} placeholder="Nome e sobrenome" autoComplete="name" style={styles.gap} />}
            <Field
              label={criando ? 'E-mail' : 'Login'}
              value={form.email}
              onChangeText={set('email')}
              placeholder="Seunome@gmail.com"
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              style={criando ? styles.gap : undefined}
            />
            <Field
              label="Senha"
              value={form.senha}
              onChangeText={set('senha')}
              placeholder={criando ? 'Mínimo de 6 caracteres' : '••••••••'}
              secureTextEntry
              autoComplete={criando ? 'new-password' : 'current-password'}
              onSubmitEditing={criando ? undefined : enviar}
              style={styles.gap}
            />
            {criando && (
              <>
                <Field label="Confirmar senha" value={form.confirma} onChangeText={set('confirma')} placeholder="••••••••" secureTextEntry style={styles.gap} />
                <Field label="Nome do pet (opcional)" value={form.petNome} onChangeText={set('petNome')} placeholder="Ex.: Mahoraga" style={styles.gap} onSubmitEditing={enviar} />
              </>
            )}
          </View>

          {aviso && <Text style={[styles.aviso, aviso.tipo === 'erro' && { color: colors.value }]}>{aviso.texto}</Text>}

          <Pressable
            onPress={enviar}
            disabled={enviando}
            style={({ pressed }) => [styles.button, (pressed || enviando) && { opacity: 0.7 }]}
          >
            <Text style={styles.buttonText}>{enviando ? 'Aguarde…' : criando ? 'Criar conta' : 'Log in'}</Text>
          </Pressable>

          {!criando && (
            <Pressable onPress={esqueci} hitSlop={10}>
              <Text style={styles.forgot}>Forgot Password</Text>
            </Pressable>
          )}

          <Pressable onPress={trocarModo} hitSlop={10} style={styles.switch}>
            <Text style={styles.switchText}>
              {criando ? 'Já tem conta? ' : 'Ainda não tem conta? '}
              <Text style={styles.switchLink}>{criando ? 'Entrar' : 'Criar conta'}</Text>
            </Text>
          </Pressable>

          {backend.mode === 'local' && !criando && (
            <Text style={styles.demo}>
              Modo demonstração: as contas ficam neste aparelho.{'\n'}Conta de exemplo: {DEMO_ACCOUNT.email} / {DEMO_ACCOUNT.senha}
            </Text>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.pink },
  content: { flexGrow: 1, alignItems: 'center', paddingTop: '18%', paddingBottom: 40 },
  gap: { marginTop: 22 },
  logo: { marginBottom: 36 },
  welcome: { fontFamily: fonts.bodyMedium, fontSize: 30, color: colors.navy, marginBottom: 48 },
  form: { width: '64%', maxWidth: 360 },
  label: { fontFamily: fonts.body, fontSize: 14, color: colors.navy },
  input: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.navy,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    paddingVertical: 4,
    outlineStyle: 'none',
  },
  aviso: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    color: colors.navy,
    textAlign: 'center',
    marginTop: 18,
    marginBottom: -26,
    width: '70%',
  },
  button: {
    marginTop: 44,
    width: '52%',
    maxWidth: 300,
    backgroundColor: colors.white,
    borderRadius: 18,
    paddingVertical: 13,
    alignItems: 'center',
    ...shadow,
  },
  buttonText: { fontFamily: fonts.body, fontSize: 15, color: '#222' },
  switch: { marginTop: 22 },
  switchText: { fontFamily: fonts.body, fontSize: 13, color: colors.navy },
  switchLink: { fontFamily: fonts.bodyMedium, color: colors.value, textDecorationLine: 'underline' },
  demo: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.navy,
    opacity: 0.75,
    textAlign: 'center',
    marginTop: 18,
    paddingHorizontal: 24,
  },
  forgot: { fontFamily: fonts.body, fontSize: 10, color: colors.navy, marginTop: 12 },
});
