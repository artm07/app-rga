import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Logo from '../components/Logo';
import { colors, fonts, shadow } from '../theme';

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

export default function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const entrar = () => {
    if (!email.trim() || !senha) {
      const msg = 'Preencha o login e a senha.';
      Platform.OS === 'web' ? window.alert(msg) : Alert.alert('Atenção', msg);
      return;
    }
    onLogin();
  };

  const esqueci = () => {
    const msg = 'Enviaremos um link de recuperação para o seu e-mail.';
    Platform.OS === 'web' ? window.alert(msg) : Alert.alert('Recuperar senha', msg);
  };

  return (
    <View style={styles.root}>
      <Blobs />
      <KeyboardAvoidingView style={styles.content} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.logo}>
          <Logo size={58} />
        </View>
        <Text style={styles.welcome}>Bem-vindo!</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Login</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Seunome@gmail.com"
            placeholderTextColor="#8A90A6"
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
          />
          <Text style={[styles.label, { marginTop: 26 }]}>Senha</Text>
          <TextInput
            style={styles.input}
            value={senha}
            onChangeText={setSenha}
            placeholder="••••••••"
            placeholderTextColor="#8A90A6"
            secureTextEntry
            onSubmitEditing={entrar}
          />
        </View>

        <Pressable onPress={entrar} style={({ pressed }) => [styles.button, pressed && { opacity: 0.85 }]}>
          <Text style={styles.buttonText}>Log in</Text>
        </Pressable>
        <Pressable onPress={esqueci} hitSlop={10}>
          <Text style={styles.forgot}>Forgot Password</Text>
        </Pressable>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.pink },
  content: { flex: 1, alignItems: 'center', paddingTop: '18%' },
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
  forgot: { fontFamily: fonts.body, fontSize: 10, color: colors.navy, marginTop: 12 },
});
