import { useEffect, useState } from 'react';
import { View, BackHandler, StyleSheet, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
// Importa só os pesos usados (deixa o site bem mais leve)
import { Quicksand_600SemiBold } from '@expo-google-fonts/quicksand/600SemiBold';
import { Quicksand_700Bold } from '@expo-google-fonts/quicksand/700Bold';
import { Poppins_400Regular } from '@expo-google-fonts/poppins/400Regular';
import { Poppins_500Medium } from '@expo-google-fonts/poppins/500Medium';
import { Poppins_500Medium_Italic } from '@expo-google-fonts/poppins/500Medium_Italic';
import { Poppins_700Bold } from '@expo-google-fonts/poppins/700Bold';
import { Poppins_700Bold_Italic } from '@expo-google-fonts/poppins/700Bold_Italic';

import LoginScreen from './src/screens/LoginScreen';
import MenuScreen from './src/screens/MenuScreen';
import RgaScreen from './src/screens/RgaScreen';
import AdminScreen from './src/screens/AdminScreen';
import {
  ConsultasScreen,
  NoticiasScreen,
  CodigoScreen,
  AdocaoScreen,
  AjudaScreen,
} from './src/screens/OtherScreens';
import { colors } from './src/theme';
import { StoreProvider, useStore } from './src/store';

const SCREENS = {
  rga: RgaScreen,
  consultas: ConsultasScreen,
  noticias: NoticiasScreen,
  codigo: CodigoScreen,
  adocao: AdocaoScreen,
  ajuda: AjudaScreen,
  admin: AdminScreen,
};

export default function App() {
  return (
    <SafeAreaProvider>
      <StoreProvider>
        <Main />
      </StoreProvider>
    </SafeAreaProvider>
  );
}

function Main() {
  const { ready, session, data, logout, isAdmin } = useStore();
  const [fontsLoaded] = useFonts({
    Quicksand_600SemiBold,
    Quicksand_700Bold,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_500Medium_Italic,
    Poppins_700Bold,
    Poppins_700Bold_Italic,
  });
  // 'menu' | uma das chaves de SCREENS (o login aparece enquanto não houver usuário)
  const [screen, setScreen] = useState('menu');

  // Botão "voltar" do Android
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (SCREENS[screen]) {
        setScreen('menu');
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [screen]);

  if (!fontsLoaded || !ready) return <View style={{ flex: 1, backgroundColor: colors.pink }} />;

  let content;
  if (!session || !data) content = <LoginScreen />;
  else if (screen === 'menu' || (screen === 'admin' && !isAdmin))
    content = <MenuScreen onOpen={setScreen} onLogout={() => (setScreen('menu'), logout())} />;
  else {
    const Screen = SCREENS[screen];
    content = <Screen onBack={() => setScreen('menu')} />;
  }

  return (
    <>
      <StatusBar style="dark" />
      {/* No navegador: o app fica numa coluna vertical centralizada, como um celular */}
      <View style={styles.page}>
        <View style={styles.app}>{content}</View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.pink, alignItems: 'center' },
  app: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.white,
    overflow: 'hidden',
    ...(Platform.OS === 'web' && {
      maxWidth: 430,
      boxShadow: '0 0 40px rgba(74, 97, 137, 0.18)',
    }),
  },
});
