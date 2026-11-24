import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { colors, fonts, shadow } from '../theme';
import { masks } from '../data';

// Campo de texto com rótulo (usado nos formulários de edição)
export function Input({ label, value, onChangeText, mask, keyboard, placeholder, style, autoFocus, multiline }) {
  return (
    <View style={style}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        style={[styles.input, multiline && { minHeight: 64, textAlignVertical: 'top' }]}
        value={value}
        onChangeText={(t) => onChangeText(mask ? masks[mask](t) : t)}
        keyboardType={keyboard || (mask ? 'number-pad' : 'default')}
        placeholder={placeholder}
        placeholderTextColor="#A2A7B8"
        autoCapitalize={keyboard === 'email-address' ? 'none' : 'sentences'}
        autoFocus={autoFocus}
        multiline={multiline}
      />
    </View>
  );
}

// Botões de escolha (ex.: Macho / Fêmea)
export function Choice({ label, options, value, onChange, style }) {
  return (
    <View style={style}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.chips}>
        {options.map((o) => {
          const on = o === value;
          return (
            <Pressable key={o} onPress={() => onChange(o)} style={[styles.chip, on && styles.chipOn]}>
              <Text style={[styles.chipText, on && styles.chipTextOn]}>{o}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export function Button({ title, onPress, variant = 'primary', icon, style, disabled }) {
  const v = VARIANTS[variant];
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [styles.button, v.box, (pressed || disabled) && { opacity: 0.6 }, style]}
    >
      {icon}
      <Text style={[styles.buttonText, v.text]}>{title}</Text>
    </Pressable>
  );
}

const VARIANTS = {
  primary: { box: { backgroundColor: colors.navy }, text: { color: colors.white } },
  mint: { box: { backgroundColor: colors.mint }, text: { color: colors.navy } },
  light: { box: { backgroundColor: colors.white, ...shadow, shadowOpacity: 0.2 }, text: { color: colors.navy } },
  ghost: { box: { backgroundColor: 'transparent' }, text: { color: colors.navy } },
  danger: { box: { backgroundColor: 'transparent' }, text: { color: colors.value } },
};

const styles = StyleSheet.create({
  label: { fontFamily: fonts.body, fontSize: 13, color: colors.navy, marginBottom: 4 },
  input: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.value,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.mint,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    outlineStyle: 'none',
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.mint,
    backgroundColor: colors.white,
  },
  chipOn: { backgroundColor: colors.mint },
  chipText: { fontFamily: fonts.body, fontSize: 14, color: colors.navy },
  chipTextOn: { fontFamily: fonts.bodyMedium },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 18,
    paddingVertical: 11,
    paddingHorizontal: 20,
  },
  buttonText: { fontFamily: fonts.bodyMedium, fontSize: 14 },
});
