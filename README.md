# App RGA

App mobile (Android / iOS / Web) do **RGA – Registro Geral Animal**, feito em [Expo](https://expo.dev) (React Native) seguindo o protótipo: tema rosa + verde menta, textos em azul marinho.

## Telas

- **Login** – "Bem-vindo!", campos de login e senha, botão *Log in* e *Forgot Password*.
- **Menu** – cards RGA, Consultas, Notícias, Código de acesso, Adoção e o mascote "Posso ajudar?". O ícone ☰ abre um menu lateral com a opção **Sair**.
- **RGA** – foto do pet, abas *RGA / Tutor / Localização / Vacinação* e a ficha (nº do registro, nome, tutor, espécie, sexo, castrado, idade, raça, pelagem, porte).
- **Consultas, Notícias, Código de acesso, Adoção, Posso ajudar? (chat)** – telas no mesmo tema.

Os dados são de exemplo e ficam em `src/data.js`; é ali que entra a integração com uma API.

## Como rodar

```bash
npm install
npx expo start
```

Depois é só ler o QR code com o app **Expo Go** no celular (Android ou iPhone), ou apertar `w` para abrir no navegador.

## Estrutura

```
App.js                  navegação entre as telas + carregamento das fontes
src/theme.js            cores, fontes e sombra do tema
src/data.js             dados de exemplo
src/components/         Logo, ícones (SVG), degradê, cabeçalho
src/screens/            Login, Menu, RGA e demais telas
assets/                 foto do pet e mascote
```
