import { createContext, useContext, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initialData } from './data';

// Estado do app salvo no aparelho (AsyncStorage no celular, localStorage no navegador).
const KEY = 'rga:dados:v1';
const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [data, setData] = useState(null);
  const loaded = useRef(false);

  useEffect(() => {
    (async () => {
      let saved = null;
      try {
        const raw = await AsyncStorage.getItem(KEY);
        saved = raw ? JSON.parse(raw) : null;
      } catch {
        // armazenamento indisponível (ex.: navegação privada): segue com os dados iniciais
      }
      setData(saved ? { ...initialData, ...saved } : initialData);
      loaded.current = true;
    })();
  }, []);

  useEffect(() => {
    if (!loaded.current || !data) return;
    AsyncStorage.setItem(KEY, JSON.stringify(data)).catch(() => {});
  }, [data]);

  // update(fn) recebe o estado atual e devolve o novo
  const update = (fn) => setData((d) => fn(d));

  return <StoreContext.Provider value={{ data, update }}>{children}</StoreContext.Provider>;
}

export const useStore = () => useContext(StoreContext);
