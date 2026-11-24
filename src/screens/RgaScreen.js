import { useState } from 'react';
import { View, Text, Image, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Gradient from '../components/Gradient';
import { BackIcon, SyringeIcon, PinIcon } from '../components/Icons';
import { pet } from '../data';
import { colors, fonts, shadow } from '../theme';

const TABS = ['RGA', 'Tutor', 'Localização', 'Vacinação'];

function Field({ label, value }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}:</Text>
      <Text style={styles.fieldValue}>{value}</Text>
    </View>
  );
}

function Fields({ rows }) {
  return (
    <View style={styles.fields}>
      {rows.map(([l, v]) => (
        <Field key={l} label={l} value={v} />
      ))}
    </View>
  );
}

function Vacinas() {
  return (
    <View style={[styles.fields, { gap: 14, paddingHorizontal: 20 }]}>
      {pet.vacinas.map((v) => (
        <View key={v.nome} style={styles.vacina}>
          <SyringeIcon />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.vacinaNome}>{v.nome}</Text>
            <Text style={styles.vacinaInfo}>
              Aplicada: <Text style={styles.vacinaData}>{v.data}</Text>
            </Text>
            <Text style={styles.vacinaInfo}>
              Próxima dose: <Text style={styles.vacinaData}>{v.proxima}</Text>
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

export default function RgaScreen({ onBack }) {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState('RGA');

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 32 }} bounces={false}>
        <View style={[styles.top, { paddingTop: insets.top + 6 }]}>
          <Gradient id="rgaBg" from={colors.white} to={colors.pink} />
          <Pressable onPress={onBack} hitSlop={16} style={styles.back} accessibilityLabel="Voltar">
            <BackIcon size={24} color="#8A90A6" />
          </Pressable>
          <View style={styles.photoFrame}>
            <Image source={pet.foto} style={styles.photo} resizeMode="cover" />
          </View>
        </View>

        <View style={styles.tabs}>
          {TABS.map((t) => {
            const active = t === tab;
            return (
              <Pressable key={t} onPress={() => setTab(t)} style={styles.tab}>
                {active && <View style={styles.tabActiveBg} />}
                <Text style={[styles.tabText, active && styles.tabTextActive]}>{t}</Text>
              </Pressable>
            );
          })}
        </View>

        {tab === 'RGA' && (
          <>
            <View style={styles.registro}>
              <Text style={styles.registroLabel}>Nº do registro</Text>
              <Text style={styles.registroNum}>{pet.registro}</Text>
            </View>
            <Fields rows={pet.rga} />
          </>
        )}
        {tab === 'Tutor' && <Fields rows={pet.tutor} />}
        {tab === 'Localização' && (
          <>
            <View style={styles.mapBox}>
              <PinIcon size={40} color={colors.value} />
            </View>
            <Fields rows={pet.localizacao} />
          </>
        )}
        {tab === 'Vacinação' && <Vacinas />}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  top: { alignItems: 'center', paddingBottom: 40, overflow: 'hidden' },
  back: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4 },
  photoFrame: {
    marginTop: 26,
    padding: 8,
    backgroundColor: '#F6F1F2',
    borderRadius: 12,
    ...shadow,
    shadowOpacity: 0.25,
  },
  photo: { width: 252, height: 172, borderRadius: 8 },
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.mint,
    height: 28,
    alignItems: 'stretch',
  },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  tabActiveBg: {
    ...StyleSheet.absoluteFillObject,
    left: -12,
    right: 4,
    backgroundColor: colors.mintDark,
    transform: [{ skewX: '-30deg' }],
  },
  tabText: { fontFamily: fonts.bodyItalic, fontSize: 13, color: colors.navy },
  tabTextActive: { fontFamily: fonts.bodyBoldItalic },
  registro: { paddingHorizontal: 24, paddingTop: 12 },
  registroLabel: { fontFamily: fonts.body, fontSize: 15, color: colors.navy },
  registroNum: { fontFamily: fonts.body, fontSize: 18, color: colors.value, letterSpacing: 0.5 },
  fields: { paddingHorizontal: 48, paddingTop: 24, gap: 12 },
  field: { flexDirection: 'row', alignItems: 'baseline', flexWrap: 'wrap' },
  fieldLabel: { fontFamily: fonts.body, fontSize: 14, color: colors.navy, marginRight: 6 },
  fieldValue: { fontFamily: fonts.body, fontSize: 17, color: colors.value },
  mapBox: {
    marginHorizontal: 24,
    marginTop: 20,
    height: 140,
    borderRadius: 16,
    backgroundColor: colors.pinkLight,
    borderWidth: 2,
    borderColor: colors.mint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vacina: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.pinkLight,
    borderRadius: 14,
    padding: 14,
    borderLeftWidth: 6,
    borderLeftColor: colors.mint,
  },
  vacinaNome: { fontFamily: fonts.bodyMedium, fontSize: 15, color: colors.navy },
  vacinaInfo: { fontFamily: fonts.body, fontSize: 13, color: colors.navy },
  vacinaData: { color: colors.value },
});
