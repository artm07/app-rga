import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, shadow } from '../theme';

export default function Logo({ size = 64 }) {
  return (
    <View style={[styles.box, { paddingHorizontal: size * 0.18, paddingVertical: size * 0.22 }]}>
      <Text style={[styles.text, { fontSize: size, lineHeight: size * 1.1, letterSpacing: -size * 0.07 }]}>
        <Text style={{ color: colors.logoGreen }}>RG</Text>
        <Text style={{ color: colors.logoPink }}>A</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#F3EEEF',
    ...shadow,
    shadowOpacity: 0.15,
  },
  text: { fontFamily: fonts.logo, includeFontPadding: false },
});
