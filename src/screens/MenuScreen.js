import { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Gradient from '../components/Gradient';
import Mascot from '../components/Mascot';
import { useStore } from '../store';
import { PawIcon, ClipboardIcon, AlertIcon, LockIcon, HeartIcon, MenuIcon, ShieldIcon } from '../components/Icons';
import { colors, fonts, shadow } from '../theme';

const ITEMS = [
  { key: 'rga', label: 'RGA', Icon: PawIcon },
  { key: 'consultas', label: 'Consultas', Icon: ClipboardIcon },
  { key: 'noticias', label: 'Notícias', Icon: AlertIcon },
  { key: 'codigo', label: 'Código de\nacesso', Icon: LockIcon },
  { key: 'adocao', label: 'Adoção', Icon: HeartIcon },
];

function MenuCard({ label, Icon, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && { transform: [{ scale: 0.98 }], opacity: 0.9 }]}
    >
      <View style={styles.iconCircle}>
        <Icon size={44} />
      </View>
      <Text style={styles.cardText}>{label}</Text>
    </Pressable>
  );
}

export default function MenuScreen({ onOpen, onLogout }) {
  const insets = useSafeAreaInsets();
  const [drawer, setDrawer] = useState(false);
  const { user, isAdmin, saveError } = useStore();
  const primeiroNome = (user?.nome || '').split(' ')[0];

  return (
    <View style={styles.root}>
      <Gradient id="menuBg" from={colors.pink} to={colors.white} />

      <View style={[styles.sidebar, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => setDrawer(true)} hitSlop={12} accessibilityLabel="Abrir menu">
          <MenuIcon />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.list, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 }]}
      >
        {ITEMS.map((it) => (
          <MenuCard key={it.key} label={it.label} Icon={it.Icon} onPress={() => onOpen(it.key)} />
        ))}

        <Pressable style={styles.help} onPress={() => onOpen('ajuda')}>
          <Mascot size={88} />
          <Text style={styles.helpText}>Posso ajudar?</Text>
        </Pressable>
        {saveError ? <Text style={styles.saveError}>{saveError}</Text> : null}
      </ScrollView>

      {drawer && (
        <Pressable style={styles.overlay} onPress={() => setDrawer(false)}>
          <Pressable style={[styles.drawer, { paddingTop: insets.top + 24 }]} onPress={() => {}}>
            <Text style={styles.drawerTitle}>{primeiroNome ? `Olá, ${primeiroNome}!` : 'Olá!'}</Text>
            <Text style={styles.drawerEmail}>{user?.email}</Text>
            {isAdmin && <Text style={styles.adminBadge}>Administrador</Text>}
            <View style={{ height: 18 }} />
            {ITEMS.map((it) => (
              <Pressable
                key={it.key}
                style={styles.drawerItem}
                onPress={() => {
                  setDrawer(false);
                  onOpen(it.key);
                }}
              >
                <it.Icon size={22} />
                <Text style={styles.drawerText}>{it.label.replace('\n', ' ')}</Text>
              </Pressable>
            ))}
            {isAdmin && (
              <Pressable
                style={[styles.drawerItem, styles.drawerAdmin]}
                onPress={() => {
                  setDrawer(false);
                  onOpen('admin');
                }}
              >
                <ShieldIcon size={22} />
                <Text style={styles.drawerText}>Administração</Text>
              </Pressable>
            )}
            <Pressable style={[styles.drawerItem, { marginTop: 'auto' }]} onPress={onLogout}>
              <Text style={[styles.drawerText, { color: colors.value, marginLeft: 0 }]}>Sair</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, flexDirection: 'row', backgroundColor: colors.white },
  sidebar: { width: 40, backgroundColor: colors.mint, alignItems: 'center' },
  scroll: { flex: 1 },
  list: { paddingHorizontal: 22, gap: 22 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.mint,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 10,
    minHeight: 84,
    ...shadow,
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: {
    flex: 1,
    fontFamily: fonts.title,
    fontSize: 24,
    color: colors.navy,
    marginLeft: 14,
    textAlign: 'left',
  },
  help: { flexDirection: 'row', alignItems: 'center', marginTop: 4, paddingLeft: 4 },
  helpText: { fontFamily: fonts.title, fontSize: 21, color: colors.navy, marginLeft: 6 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(74,97,137,0.35)' },
  drawer: {
    width: '72%',
    maxWidth: 320,
    height: '100%',
    backgroundColor: colors.pinkLight,
    paddingHorizontal: 20,
    paddingBottom: 32,
    borderRightWidth: 8,
    borderRightColor: colors.mint,
  },
  drawerTitle: { fontFamily: fonts.titleBold, fontSize: 22, color: colors.navy },
  saveError: { fontFamily: fonts.bodyMedium, fontSize: 12, color: colors.value, textAlign: 'center' },
  adminBadge: {
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
  drawerAdmin: { borderTopWidth: 1, borderTopColor: colors.mint, marginTop: 8, paddingTop: 16 },
  drawerEmail: { fontFamily: fonts.body, fontSize: 12, color: colors.navy, opacity: 0.8 },
  drawerItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  drawerText: { fontFamily: fonts.title, fontSize: 18, color: colors.navy, marginLeft: 12 },
});
