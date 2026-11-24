import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import backend from './backend';
import { initialGlobal, newUserData } from './data';

// Estado do app: sessão (quem está logado), dados da conta e conteúdo compartilhado.
// Os dados da conta são salvos automaticamente (no servidor ou no aparelho).
const SESSION_KEY = 'rga:sessao';
const StoreContext = createContext(null);

const saveSession = (s) =>
  (s ? AsyncStorage.setItem(SESSION_KEY, JSON.stringify(s)) : AsyncStorage.removeItem(SESSION_KEY)).catch(() => {});

export function StoreProvider({ children }) {
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState(null);
  const [data, setData] = useState(null);
  const [global, setGlobal] = useState(initialGlobal);
  const [saveError, setSaveError] = useState('');
  const loadedFor = useRef(null); // conta cujos dados já vieram do armazenamento
  const timer = useRef(null);

  const enter = useCallback(async (s) => {
    const [d, g] = await Promise.all([backend.loadData(s), backend.loadGlobal(s).catch(() => initialGlobal)]);
    loadedFor.current = s.user.id;
    setData(d || newUserData({ nome: s.user.nome, email: s.user.email }));
    setGlobal(g || initialGlobal);
    setSession(s);
    saveSession(s);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(SESSION_KEY);
        const s = await backend.restoreSession(raw ? JSON.parse(raw) : null);
        if (s) await enter(s);
        else saveSession(null);
      } catch {
        saveSession(null);
      }
      setReady(true);
    })();
  }, [enter]);

  // Salva os dados da conta (meio segundo depois da última alteração)
  useEffect(() => {
    if (!session || !data || loadedFor.current !== session.user.id) return;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      Promise.resolve(backend.saveData(session, data))
        .then(() => setSaveError(''))
        .catch((e) => setSaveError(e?.message || 'Não foi possível salvar.'));
    }, 500);
    return () => clearTimeout(timer.current);
  }, [data, session]);

  const value = {
    ready,
    session,
    user: session?.user || null,
    isAdmin: session?.user?.role === 'admin',
    data,
    global,
    saveError,
    backend,
    update: (fn) => setData((d) => fn(d)),
    setGlobal,
    login: async (cred) => enter(await backend.login(cred)),
    register: async (dados) => enter(await backend.register(dados)),
    logout: async () => {
      clearTimeout(timer.current);
      if (session && data) await Promise.resolve(backend.saveData(session, data)).catch(() => {});
      backend.logout(session);
      loadedFor.current = null;
      saveSession(null);
      setSession(null);
      setData(null);
    },
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export const useStore = () => useContext(StoreContext);
