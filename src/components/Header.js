import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BackIcon } from './Icons';
import { colors, fonts } from '../theme';

export default function Header({ title, onBack }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.wrap, { paddingTop: insets.top + 8 }]}>
      <Pressable onPress={onBack} hitSlop={16} style={styles.back} accessibilityLabel="Voltar">
        <BackIcon size={26} />
      </Pressable>
      {title ? <Text style={styles.title}>{title}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingBottom: 8 },
  back: { padding: 4 },
  title: { fontFamily: fonts.titleBold, fontSize: 22, color: colors.navy, marginLeft: 8 },
});
