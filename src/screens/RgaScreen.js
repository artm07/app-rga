import { useState } from 'react';
import { View, Text, Image, Pressable, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Gradient from '../components/Gradient';
import { BackIcon, SyringeIcon, PinIcon, PencilIcon, PlusIcon, TrashIcon, CameraIcon } from '../components/Icons';
import { Input, Choice, Button } from '../components/ui';
import { useStore } from '../store';
import { pickPhoto } from '../pickPhoto';
import { RGA_FIELDS, TUTOR_FIELDS, LOCAL_FIELDS, DEFAULT_PET_PHOTO, getPath, setPath, newId } from '../data';
import { colors, fonts, shadow } from '../theme';

const TABS = ['RGA', 'Tutor', 'Localização', 'Vacinação'];
const FIELDS = { RGA: RGA_FIELDS, Tutor: TUTOR_FIELDS, 'Localização': LOCAL_FIELDS };

function Field({ label, value }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}:</Text>
      <Text style={styles.fieldValue}>{value || '—'}</Text>
    </View>
  );
}

function FieldList({ fields, pet, draft, setDraft }) {
  if (!draft) {
    return (
      <View style={styles.fields}>
        {fields.map((f) => (
          <Field key={f.path} label={f.label} value={getPath(pet, f.path)} />
        ))}
      </View>
    );
  }
  return (
    <View style={[styles.fields, styles.form]}>
      {fields.map((f) =>
        f.options ? (
          <Choice
            key={f.path}
            label={f.label}
            options={f.options}
            value={getPath(draft, f.path)}
            onChange={(v) => setDraft((d) => setPath(d, f.path, v))}
          />
        ) : (
          <Input
            key={f.path}
            label={f.label}
            value={getPath(draft, f.path) || ''}
            mask={f.mask}
            keyboard={f.keyboard}
            onChangeText={(v) => setDraft((d) => setPath(d, f.path, v))}
          />
        )
      )}
    </View>
  );
}

const emptyVacina = { nome: '', data: '', proxima: '' };

function Vacinas({ vacinas, onAdd, onRemove }) {
  const [form, setForm] = useState(null);
  const [erro, setErro] = useState('');

  const salvar = () => {
    if (!form.nome.trim() || form.data.length !== 10) {
      setErro('Informe o nome da vacina e a data de aplicação (dd/mm/aaaa).');
      return;
    }
    onAdd({ id: newId(), ...form, nome: form.nome.trim() });
    setForm(null);
    setErro('');
  };

  return (
    <View style={styles.vacinas}>
      {vacinas.length === 0 && !form && <Text style={styles.empty}>Nenhuma vacina registrada ainda.</Text>}
      {vacinas.map((v) => (
        <View key={v.id} style={styles.vacina}>
          <SyringeIcon />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.vacinaNome}>{v.nome}</Text>
            <Text style={styles.vacinaInfo}>
              Aplicada: <Text style={styles.vacinaData}>{v.data}</Text>
            </Text>
            {v.proxima ? (
              <Text style={styles.vacinaInfo}>
                Próxima dose: <Text style={styles.vacinaData}>{v.proxima}</Text>
              </Text>
            ) : null}
          </View>
          <Pressable onPress={() => onRemove(v.id)} hitSlop={10} accessibilityLabel={`Remover ${v.nome}`}>
            <TrashIcon color={colors.value} />
          </Pressable>
        </View>
      ))}

      {form ? (
        <View style={[styles.vacina, styles.form, { flexDirection: 'column', alignItems: 'stretch' }]}>
          <Input label="Vacina" value={form.nome} onChangeText={(t) => setForm({ ...form, nome: t })} autoFocus />
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Input
              style={{ flex: 1 }}
              label="Aplicada em"
              placeholder="dd/mm/aaaa"
              mask="date"
              value={form.data}
              onChangeText={(t) => setForm({ ...form, data: t })}
            />
            <Input
              style={{ flex: 1 }}
              label="Próxima dose"
              placeholder="dd/mm/aaaa"
              mask="date"
              value={form.proxima}
              onChangeText={(t) => setForm({ ...form, proxima: t })}
            />
          </View>
          {erro ? <Text style={styles.erro}>{erro}</Text> : null}
          <View style={styles.formActions}>
            <Button title="Cancelar" variant="ghost" onPress={() => (setForm(null), setErro(''))} />
            <Button title="Salvar vacina" onPress={salvar} />
          </View>
        </View>
      ) : (
        <Button title="Adicionar vacina" variant="mint" icon={<PlusIcon />} onPress={() => setForm(emptyVacina)} />
      )}
    </View>
  );
}

export default function RgaScreen({ onBack }) {
  const insets = useSafeAreaInsets();
  const { data, update } = useStore();
  const pet = data.pet;
  const [tab, setTab] = useState('RGA');
  const [draft, setDraft] = useState(null); // cópia do pet enquanto edita
  const [fotoErro, setFotoErro] = useState('');

  const editing = !!draft;
  const shown = draft || pet;
  const foto = shown.foto ? { uri: shown.foto } : DEFAULT_PET_PHOTO;

  const salvar = () => {
    update((d) => ({ ...d, pet: { ...draft, vacinas: d.pet.vacinas } }));
    setDraft(null);
  };

  const trocarFoto = async () => {
    try {
      setFotoErro('');
      const uri = await pickPhoto();
      if (uri) setDraft((d) => ({ ...(d || pet), foto: uri }));
    } catch (e) {
      setFotoErro(e.message || 'Não foi possível abrir as fotos.');
    }
  };

  const setVacinas = (fn) => update((d) => ({ ...d, pet: { ...d.pet, vacinas: fn(d.pet.vacinas) } }));

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 32 }} keyboardShouldPersistTaps="handled">
        <View style={[styles.top, { paddingTop: insets.top + 6 }]}>
          <Gradient id="rgaBg" from={colors.white} to={colors.pink} />
          <View style={styles.topBar}>
            <Pressable onPress={onBack} hitSlop={16} style={styles.back} accessibilityLabel="Voltar">
              <BackIcon size={24} color="#8A90A6" />
            </Pressable>
            {!editing && tab !== 'Vacinação' && (
              <Pressable onPress={() => setDraft(pet)} style={styles.editBtn} accessibilityLabel="Editar dados">
                <PencilIcon size={16} />
                <Text style={styles.editText}>Editar</Text>
              </Pressable>
            )}
          </View>
          <Pressable onPress={trocarFoto} style={styles.photoFrame} accessibilityLabel="Trocar foto do pet">
            <Image source={foto} style={styles.photo} resizeMode="cover" />
            <View style={styles.photoBadge}>
              <CameraIcon size={18} />
            </View>
          </Pressable>
          {fotoErro ? <Text style={[styles.erro, { marginTop: 10 }]}>{fotoErro}</Text> : null}
        </View>

        <View style={styles.tabs}>
          {TABS.map((t, i) => {
            const active = t === tab;
            const locked = editing && t === 'Vacinação';
            // Fundo inclinado fica dentro da própria aba; na primeira/última ele encosta na borda da tela
            const bgEdges = { left: i === 0 ? -20 : 6, right: i === TABS.length - 1 ? -20 : 6 };
            return (
              <Pressable
                key={t}
                onPress={() => !locked && setTab(t)}
                style={[styles.tab, { flex: t.length + 5 }, locked && { opacity: 0.4 }]}
              >
                {active && <View style={[styles.tabActiveBg, bgEdges]} />}
                <Text style={[styles.tabText, active && styles.tabTextActive]}>{t}</Text>
              </Pressable>
            );
          })}
        </View>

        {tab === 'RGA' && (
          <View style={styles.registro}>
            <Text style={styles.registroLabel}>Nº do registro</Text>
            <Text style={styles.registroNum}>{pet.registro.replace(/[.-]/g, (c) => ` ${c} `)}</Text>
          </View>
        )}
        {tab === 'Localização' && !editing && (
          <View style={styles.mapBox}>
            <PinIcon size={36} color={colors.value} />
            <Text style={styles.mapText}>
              {[pet.local.endereco, pet.local.bairro, pet.local.cidade].filter(Boolean).join(' · ')}
            </Text>
          </View>
        )}
        {FIELDS[tab] && <FieldList fields={FIELDS[tab]} pet={pet} draft={draft} setDraft={setDraft} />}
        {tab === 'Vacinação' && (
          <Vacinas
            vacinas={pet.vacinas}
            onAdd={(v) => setVacinas((list) => [...list, v])}
            onRemove={(id) => setVacinas((list) => list.filter((v) => v.id !== id))}
          />
        )}

        {editing && (
          <View style={[styles.formActions, { paddingHorizontal: 24, marginTop: 24 }]}>
            <Button title="Cancelar" variant="ghost" onPress={() => setDraft(null)} />
            <Button title="Salvar alterações" onPress={salvar} />
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  top: { alignItems: 'center', paddingBottom: 40, overflow: 'hidden' },
  topBar: { alignSelf: 'stretch', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  back: { paddingHorizontal: 10, paddingVertical: 4 },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginRight: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: colors.mint,
  },
  editText: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.navy },
  photoFrame: {
    marginTop: 18,
    padding: 8,
    backgroundColor: '#F6F1F2',
    borderRadius: 12,
    ...shadow,
    shadowOpacity: 0.25,
  },
  photo: { width: 252, height: 172, borderRadius: 8 },
  photoBadge: {
    position: 'absolute',
    right: -8,
    bottom: -8,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.mint,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  tabs: { flexDirection: 'row', backgroundColor: colors.mint, height: 30, alignItems: 'stretch', overflow: 'hidden' },
  tab: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 2 },
  tabActiveBg: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    backgroundColor: colors.mintDark,
    transform: [{ skewX: '-20deg' }],
  },
  tabText: { fontFamily: fonts.bodyItalic, fontSize: 13, color: colors.navy, textAlign: 'center' },
  tabTextActive: { fontFamily: fonts.bodyBoldItalic },
  registro: { paddingHorizontal: 24, paddingTop: 12 },
  registroLabel: { fontFamily: fonts.body, fontSize: 15, color: colors.navy },
  registroNum: { fontFamily: fonts.body, fontSize: 18, color: colors.value, letterSpacing: 0.5 },
  fields: { paddingHorizontal: 48, paddingTop: 24, gap: 12 },
  form: { paddingHorizontal: 24, gap: 14 },
  field: { flexDirection: 'row', alignItems: 'baseline', flexWrap: 'wrap' },
  fieldLabel: { fontFamily: fonts.body, fontSize: 14, color: colors.navy, marginRight: 6 },
  fieldValue: { fontFamily: fonts.body, fontSize: 17, color: colors.value, flexShrink: 1 },
  mapBox: {
    marginHorizontal: 24,
    marginTop: 20,
    paddingVertical: 22,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: colors.pinkLight,
    borderWidth: 2,
    borderColor: colors.mint,
    alignItems: 'center',
    gap: 8,
  },
  mapText: { fontFamily: fonts.body, fontSize: 13, color: colors.navy, textAlign: 'center' },
  vacinas: { paddingHorizontal: 20, paddingTop: 24, gap: 14 },
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
  empty: { fontFamily: fonts.body, fontSize: 14, color: colors.navy, textAlign: 'center' },
  erro: { fontFamily: fonts.bodyMedium, fontSize: 12, color: colors.value },
  formActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8 },
});
