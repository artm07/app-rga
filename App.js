import { useEffect, useState } from 'react';
import { View, BackHandler, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, Quicksand_600SemiBold, Quicksand_700Bold } from '@expo-google-fonts/quicksand';
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_500Medium_Italic,
  Poppins_700Bold,
  Poppins_700Bold_Italic,
} from '@expo-google-fonts/poppins';

import LoginScreen from './src/screens/LoginScreen';
import MenuScreen from './src/screens/MenuScreen';
import RgaScreen from './src/screens/RgaScreen';
import {
  ConsultasScreen,
  NoticiasScreen,
  CodigoScreen,
  AdocaoScreen,
  AjudaScreen,
} from './src/screens/OtherScreens';
import { colors } from './src/theme';

const SCREENS = {
  rga: RgaScreen,
  consultas: ConsultasScreen,
  noticias: NoticiasScreen,
  codigo: CodigoScreen,
  adocao: AdocaoScreen,
  ajuda: AjudaScreen,
};

export default function App() {
  const [fontsLoaded] = useFonts({
    Quicksand_600SemiBold,
    Quicksand_700Bold,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_500Medium_Italic,
    Poppins_700Bold,
    Poppins_700Bold_Italic,
  });
  // 'login' | 'menu' | uma das chaves de SCREENS
  const [screen, setScreen] = useState('login');

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

  if (!fontsLoaded) return <View style={{ flex: 1, backgroundColor: colors.pink }} />;

  let content;
  if (screen === 'login') content = <LoginScreen onLogin={() => setScreen('menu')} />;
  else if (screen === 'menu')
    content = <MenuScreen onOpen={setScreen} onLogout={() => setScreen('login')} />;
  else {
    const Screen = SCREENS[screen];
    content = <Screen onBack={() => setScreen('menu')} />;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <View style={styles.app}>{content}</View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  app: { flex: 1, backgroundColor: colors.white },
});
