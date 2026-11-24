# App RGA

App mobile (Android / iOS / Web) do **RGA – Registro Geral Animal**, feito em [Expo](https://expo.dev) (React Native) seguindo o protótipo: tema rosa + verde menta, textos em azul marinho.

## Telas

- **Login** – "Bem-vindo!", campos de login e senha, botão *Log in* e *Forgot Password*.
- **Menu** – cards RGA, Consultas, Notícias, Código de acesso, Adoção e o mascote "Posso ajudar?". O ícone ☰ abre um menu lateral com a opção **Sair**.
- **RGA** – foto do pet, abas *RGA / Tutor / Localização / Vacinação* e a ficha (nº do registro, nome, tutor, espécie, sexo, castrado, idade, raça, pelagem, porte).
- **Consultas, Notícias, Código de acesso, Adoção, Posso ajudar? (chat)** – telas no mesmo tema.

## O que dá para editar

Tudo fica salvo no aparelho (no navegador, no próprio navegador) e continua lá ao fechar e abrir o app.

- **RGA:** botão **Editar** muda os dados do pet, do tutor e do endereço; tocar na foto troca a imagem (galeria do celular ou arquivo no computador).
- **Vacinação:** adicionar e remover vacinas.
- **Consultas:** criar, remover e mudar a situação (Agendada → Realizada → Cancelada) tocando na etiqueta.
- **Adoção:** divulgar um animal, remover e marcar "Quero adotar".
- **Código de acesso:** copiar e gerar um novo.
- **Posso ajudar?:** o chat responde perguntas sobre vacinas, consultas, código e adoção, e guarda o histórico.
- O login fica lembrado até tocar em **Sair** no menu ☰.

Os dados iniciais são de exemplo e ficam em `src/data.js`; o salvamento fica em `src/store.js`. É ali que entra a integração com uma API quando houver.

## Como rodar

```bash
npm install
npx expo start
```

Depois é só ler o QR code com o app **Expo Go** no celular (Android ou iPhone), ou apertar `w` para abrir no navegador.

## Versão para navegador

No navegador o app aparece numa coluna vertical centralizada (até 430 px de largura), igual a um celular. No computador sobra o fundo rosa dos lados; no celular ocupa a tela inteira.

```bash
npm run build:web
```

Isso gera **`web/index.html`**: um arquivo único, com fontes e imagens embutidas, que funciona até aberto direto do computador (duplo clique) e pode ser hospedado em qualquer lugar (GitHub Pages, Netlify, Vercel, servidor próprio...).

## Estrutura

```
App.js                  navegação entre as telas + carregamento das fontes
src/theme.js            cores, fontes e sombra do tema
src/data.js             dados iniciais e campos de cada aba
src/store.js            estado do app salvo no aparelho
src/components/         Logo, ícones (SVG), degradê, cabeçalho
src/screens/            Login, Menu, RGA e demais telas
scripts/single-html.js  junta o build web num único web/index.html
assets/                 foto do pet e quadros da animação do mascote
```
