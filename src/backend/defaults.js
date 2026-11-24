// Dados iniciais usados pelo app e pelo servidor (sem imagens nem código de React Native).

// Dados de exemplo (o tutor do protótipo). Usados na conta de demonstração.
export const demoUserData = {
  pet: {
    registro: '123.456.789-0',
    foto: 'demo', // 'demo' = foto do protótipo; null = sem foto; senão uma URI (data:/file:)
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
  codigo: '482 913',
  interesses: [], // ids de animais da Adoção marcados com "Quero adotar"
  chat: [{ id: 'm0', de: 'bot', texto: 'Oi! Eu sou o Miau 🐾 Pode perguntar o que quiser sobre os cuidados com o seu pet.' }],
};

export const DEMO_ACCOUNT = { nome: 'Arthur Martins', email: 'arthur@email.com', senha: '123456' };

const rand = (n) => String(Math.floor(Math.random() * 10 ** n)).padStart(n, '0');
const novoRegistro = () => `${rand(3)}.${rand(3)}.${rand(3)}-${rand(1)}`;
const novoCodigo = () => `${rand(3)} ${rand(3)}`;

// Dados de uma conta nova: ficha em branco, já com o nome e o e-mail do tutor
export function newUserData({ nome, email, petNome = '' }) {
  return {
    pet: {
      registro: novoRegistro(),
      foto: null,
      nome: petNome,
      especie: '',
      sexo: '',
      castrado: '',
      idade: '',
      raca: '',
      pelagem: '',
      porte: '',
      tutor: { nome, cpf: '', telefone: '', email },
      local: { endereco: '', bairro: '', cidade: '', cep: '' },
      vacinas: [],
    },
    consultas: [],
    codigo: novoCodigo(),
    interesses: [],
    chat: [{ id: 'm0', de: 'bot', texto: `Oi, ${nome.split(' ')[0]}! Eu sou o Miau 🐾 Pode perguntar o que quiser sobre os cuidados com o seu pet.` }],
  };
}

// Conteúdo compartilhado entre todas as contas (o administrador gerencia)
export const initialGlobal = {
  noticias: [
    { id: 'n1', titulo: 'Campanha de vacinação antirrábica', texto: 'Postos de vacinação gratuita para cães e gatos neste fim de semana.' },
    { id: 'n2', titulo: 'Castração gratuita', texto: 'Inscrições abertas para o mutirão de castração do mês de dezembro.' },
    { id: 'n3', titulo: 'Mantenha o RGA atualizado', texto: 'Mudou de endereço ou telefone? Atualize os dados do tutor no app.' },
  ],
  adocao: [
    { id: 'a1', nome: 'Luna', info: 'Gata · 1 ano · Castrada', autor: null },
    { id: 'a2', nome: 'Thor', info: 'Cão · 3 anos · Porte médio', autor: null },
    { id: 'a3', nome: 'Mel', info: 'Gata · 4 meses · Filhote', autor: null },
  ],
};
