// Campos da ficha, máscaras de digitação e utilitários de dados do app.
// Os dados de cada conta são salvos pelo src/store.js (no servidor ou no aparelho).

export const DEFAULT_PET_PHOTO = require('../assets/pet.jpg');

let seq = 0;
export const newId = () => `${Date.now().toString(36)}-${(seq++).toString(36)}`;

// Dados iniciais (conta de exemplo, conta nova e conteúdo compartilhado) ficam em
// src/backend/defaults.js, que também é usado pelo servidor.
export { demoUserData, DEMO_ACCOUNT, newUserData, initialGlobal } from './backend/defaults';

// Campos de cada aba da ficha. `path` aponta para dentro de `pet`;
// `options` vira botões de escolha no modo de edição.
export const RGA_FIELDS = [
  { label: 'Nome', path: 'nome' },
  { label: 'Tutor', path: 'tutor.nome' },
  { label: 'Espécie', path: 'especie', options: ['Gato', 'Cachorro', 'Outro'] },
  { label: 'Sexo', path: 'sexo', options: ['Macho', 'Fêmea'] },
  { label: 'Castrado(a)', path: 'castrado', options: ['Sim', 'Não'] },
  { label: 'Idade', path: 'idade' },
  { label: 'Raça', path: 'raca' },
  { label: 'Pelagem', path: 'pelagem' },
  { label: 'Porte', path: 'porte', options: ['Pequeno', 'Médio', 'Grande'] },
];

export const TUTOR_FIELDS = [
  { label: 'Nome', path: 'tutor.nome' },
  { label: 'CPF', path: 'tutor.cpf', keyboard: 'number-pad', mask: 'cpf' },
  { label: 'Telefone', path: 'tutor.telefone', keyboard: 'phone-pad', mask: 'phone' },
  { label: 'E-mail', path: 'tutor.email', keyboard: 'email-address' },
];

export const LOCAL_FIELDS = [
  { label: 'Endereço', path: 'local.endereco' },
  { label: 'Bairro', path: 'local.bairro' },
  { label: 'Cidade', path: 'local.cidade' },
  { label: 'CEP', path: 'local.cep', keyboard: 'number-pad', mask: 'cep' },
];

export const getPath = (obj, path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);

export const setPath = (obj, path, value) => {
  const [k, ...rest] = path.split('.');
  return { ...obj, [k]: rest.length ? setPath(obj[k] || {}, rest.join('.'), value) : value };
};

// Máscaras simples de digitação
const digits = (s) => s.replace(/\D/g, '');
export const masks = {
  date: (s) => digits(s).slice(0, 8).replace(/^(\d{2})(\d)/, '$1/$2').replace(/^(\d{2}\/\d{2})(\d)/, '$1/$2'),
  cpf: (s) =>
    digits(s)
      .slice(0, 11)
      .replace(/^(\d{3})(\d)/, '$1.$2')
      .replace(/^(\d{3}\.\d{3})(\d)/, '$1.$2')
      .replace(/^(\d{3}\.\d{3}\.\d{3})(\d)/, '$1-$2'),
  phone: (s) => {
    const d = digits(s).slice(0, 11);
    if (d.length <= 2) return d.replace(/^(\d+)/, '($1');
    if (d.length <= 6) return d.replace(/^(\d{2})(\d+)/, '($1) $2');
    if (d.length <= 10) return d.replace(/^(\d{2})(\d{4})(\d+)/, '($1) $2-$3');
    return d.replace(/^(\d{2})(\d{5})(\d+)/, '($1) $2-$3');
  },
  cep: (s) => digits(s).slice(0, 8).replace(/^(\d{5})(\d)/, '$1-$2'),
};
