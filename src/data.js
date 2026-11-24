// Dados iniciais (de exemplo, iguais aos do protótipo).
// Tudo que o usuário edita no app é salvo no aparelho (ver src/store.js).
// Quando houver uma API/back-end, é aqui e no store que entra a integração.

export const DEFAULT_PET_PHOTO = require('../assets/pet.jpg');

let seq = 0;
export const newId = () => `${Date.now().toString(36)}-${(seq++).toString(36)}`;

export const initialData = {
  user: null, // { email } depois do login
  pet: {
    registro: '123.456.789-0',
    foto: null, // null = foto padrão; senão uma URI (data:/file:)
    nome: 'Mahoraga',
    especie: 'Gato',
    sexo: 'Macho',
    castrado: 'Sim',
    idade: '6 anos e 7 meses',
    raca: 'Persa',
    pelagem: 'Branco',
    porte: 'Médio',
    tutor: {
      nome: 'Arthur Martins',
      cpf: '123.456.789-00',
      telefone: '(11) 98765-4321',
      email: 'arthur@email.com',
    },
    local: {
      endereco: 'Rua das Flores, 123',
      bairro: 'Centro',
      cidade: 'São Paulo - SP',
      cep: '01000-000',
    },
    vacinas: [
      { id: 'v1', nome: 'Antirrábica', data: '12/03/2026', proxima: '12/03/2027' },
      { id: 'v2', nome: 'V5 (Quíntupla felina)', data: '20/01/2026', proxima: '20/01/2027' },
      { id: 'v3', nome: 'FeLV', data: '05/08/2025', proxima: '05/08/2026' },
    ],
  },
  consultas: [
    { id: 'c1', data: '18/11/2026', tipo: 'Check-up anual', local: 'Clínica Vet Amigo', status: 'Realizada' },
    { id: 'c2', data: '02/12/2026', tipo: 'Retorno - exames', local: 'Clínica Vet Amigo', status: 'Agendada' },
  ],
  noticias: [
    { id: 'n1', titulo: 'Campanha de vacinação antirrábica', texto: 'Postos de vacinação gratuita para cães e gatos neste fim de semana.' },
    { id: 'n2', titulo: 'Castração gratuita', texto: 'Inscrições abertas para o mutirão de castração do mês de dezembro.' },
    { id: 'n3', titulo: 'Mantenha o RGA atualizado', texto: 'Mudou de endereço ou telefone? Atualize os dados do tutor no app.' },
  ],
  adocao: [
    { id: 'a1', nome: 'Luna', info: 'Gata · 1 ano · Castrada', interesse: false },
    { id: 'a2', nome: 'Thor', info: 'Cão · 3 anos · Porte médio', interesse: false },
    { id: 'a3', nome: 'Mel', info: 'Gata · 4 meses · Filhote', interesse: false },
  ],
  codigo: '482 913',
  chat: [{ id: 'm0', de: 'bot', texto: 'Oi! Eu sou o assistente do RGA. Como posso ajudar?' }],
};

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
