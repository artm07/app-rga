// Dados de exemplo do pet (iguais aos do protótipo).
// Quando houver uma API/back-end, é só trocar por uma chamada aqui.
export const pet = {
  registro: '123 . 456 . 789 - 0',
  foto: require('../assets/pet.jpg'),
  rga: [
    ['Nome', 'Mahoraga'],
    ['Tutor', 'Arthur Martins'],
    ['Espécie', 'Gato'],
    ['Sexo', 'Macho'],
    ['Castrado(a)', 'Sim'],
    ['Idade', '6 anos e 7 meses'],
    ['Raça', 'Persa'],
    ['Pelagem', 'Branco'],
    ['Porte', 'Médio'],
  ],
  tutor: [
    ['Nome', 'Arthur Martins'],
    ['CPF', '***.456.789-**'],
    ['Telefone', '(11) 98765-4321'],
    ['E-mail', 'arthur@email.com'],
  ],
  localizacao: [
    ['Endereço', 'Rua das Flores, 123'],
    ['Bairro', 'Centro'],
    ['Cidade', 'São Paulo - SP'],
    ['CEP', '01000-000'],
  ],
  vacinas: [
    { nome: 'Antirrábica', data: '12/03/2026', proxima: '12/03/2027' },
    { nome: 'V5 (Quíntupla felina)', data: '20/01/2026', proxima: '20/01/2027' },
    { nome: 'FeLV', data: '05/08/2025', proxima: '05/08/2026' },
  ],
};

export const consultas = [
  { data: '18/11/2026', tipo: 'Check-up anual', local: 'Clínica Vet Amigo', status: 'Realizada' },
  { data: '02/12/2026', tipo: 'Retorno - exames', local: 'Clínica Vet Amigo', status: 'Agendada' },
];

export const noticias = [
  { titulo: 'Campanha de vacinação antirrábica', texto: 'Postos de vacinação gratuita para cães e gatos neste fim de semana.' },
  { titulo: 'Castração gratuita', texto: 'Inscrições abertas para o mutirão de castração do mês de dezembro.' },
  { titulo: 'Mantenha o RGA atualizado', texto: 'Mudou de endereço ou telefone? Atualize os dados do tutor no app.' },
];

export const adocao = [
  { nome: 'Luna', info: 'Gata · 1 ano · Castrada' },
  { nome: 'Thor', info: 'Cão · 3 anos · Porte médio' },
  { nome: 'Mel', info: 'Gata · 4 meses · Filhote' },
];
