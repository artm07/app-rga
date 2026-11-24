# App RGA

App mobile (Android / iOS / Web) do **RGA – Registro Geral Animal**, feito em [Expo](https://expo.dev) (React Native) seguindo o protótipo: tema rosa + verde menta, textos em azul marinho.

## Telas

- **Login** – "Bem-vindo!", campos de login e senha, botão *Log in* e *Forgot Password*.
- **Menu** – cards RGA, Consultas, Notícias, Código de acesso, Adoção e o mascote "Posso ajudar?". O ícone ☰ abre um menu lateral com a opção **Sair**.
- **RGA** – foto do pet, abas *RGA / Tutor / Localização / Vacinação* e a ficha (nº do registro, nome, tutor, espécie, sexo, castrado, idade, raça, pelagem, porte).
- **Consultas, Notícias, Código de acesso, Adoção, Posso ajudar? (chat)** – telas no mesmo tema.

## Contas e administrador

- **Criar conta:** na tela de login, toque em **Criar conta** (nome, e-mail, senha e, se quiser, o nome do pet). Cada conta tem a sua própria ficha, vacinas, consultas e conversa com o assistente.
- **Administrador:** a **primeira conta criada** vira administradora. No menu ☰ aparece **Administração**, com:
  - **Resumo:** total de contas, administradores, contas bloqueadas, vacinas vencidas, consultas agendadas e pets por espécie;
  - **Contas:** busca por nome, e-mail, pet ou nº do RGA; ver a ficha do pet; tornar/remover administrador; bloquear/desbloquear; gerar senha provisória; excluir conta;
  - **Notícias:** publicar, editar e remover as notícias que todos veem;
  - **Adoção:** ver quem divulgou cada animal e quem marcou "Quero adotar", e remover anúncios.
- Ninguém consegue bloquear, excluir ou rebaixar a própria conta, e sempre fica pelo menos um administrador.
- **Esqueci a senha:** o administrador gera uma senha provisória e repassa ao tutor.

Onde as contas ficam:

- **Com o servidor** (`EXPO_PUBLIC_API_URL` definida): contas reais e centralizadas. Senhas guardadas com hash (scrypt), sessão de 30 dias, limite de tentativas de login. O administrador vê todas as contas.
- **Sem servidor (modo demonstração, inclusive no link publicado):** as contas ficam no próprio aparelho/navegador, então o administrador só vê as contas criadas ali. Já vem uma conta de exemplo: `arthur@email.com` / `123456` (tutor).

## O que dá para editar

Tudo fica salvo no aparelho (no navegador, no próprio navegador) e continua lá ao fechar e abrir o app.

- **RGA:** botão **Editar** muda os dados do pet, do tutor e do endereço; tocar na foto troca a imagem (galeria do celular ou arquivo no computador).
- **Vacinação:** adicionar e remover vacinas.
- **Consultas:** criar, remover e mudar a situação (Agendada → Realizada → Cancelada) tocando na etiqueta.
- **Adoção:** divulgar um animal, remover e marcar "Quero adotar".
- **Código de acesso:** copiar e gerar um novo.
- **Posso ajudar?:** chat com IA (Claude) que só responde sobre cuidados com animais e o uso do app — veja abaixo.
- O login fica lembrado até tocar em **Sair** no menu ☰.

Cada conta salva os próprios dados (no servidor, ou no aparelho no modo demonstração).

Os dados iniciais ficam em `src/backend/defaults.js`; o salvamento fica em `src/store.js` e `src/backend/`.

## Como rodar

```bash
npm install
npx expo start
```

Depois é só ler o QR code com o app **Expo Go** no celular (Android ou iPhone), ou apertar `w` para abrir no navegador.

## Assistente com IA ("Posso ajudar?")

O gato Miau responde com IA, **só sobre cuidados com animais** (saúde, vacinas, alimentação, comportamento, adoção) e sobre o uso do app. Perguntas de outros assuntos ele recusa com gentileza. As regras ficam em `src/ai/rules.js`; ele também recebe os dados do pet (nome, idade, vacinas, consultas) para responder sob medida.

Como a IA é ligada:

1. **Link publicado no claude.ai:** usa o Claude da conta de quem abre o link (na 1ª pergunta aparece um pedido de permissão). Não precisa configurar nada.
2. **App no celular / site próprio:** usa o servidor em `server/` (o mesmo das contas), porque a chave da API **nunca** pode ficar dentro do app (qualquer pessoa conseguiria extrair). O servidor guarda a chave, aplica as mesmas regras e só atende quem está logado.

```bash
cd server
npm install
ANTHROPIC_API_KEY=sk-ant-... npm start      # http://localhost:8787
```

Depois, no app, crie um arquivo `.env` na raiz com o endereço do servidor e rode de novo:

```bash
EXPO_PUBLIC_API_URL=https://seu-servidor.com
```

O servidor pode ser hospedado em qualquer serviço de Node 22+ (Render, Railway, Fly.io, um VPS...) com o comando de início `cd server && npm install && npm start` e a variável `ANTHROPIC_API_KEY` no painel do serviço. Opções: `ALLOWED_ORIGIN` (aceitar só o domínio do seu site), `ADMIN_EMAILS` (e-mails que já entram como administradores, separados por vírgula) e `DATA_FILE` (onde fica o arquivo com os dados; use um disco persistente do serviço, senão as contas somem a cada nova publicação). A chave é criada em console.anthropic.com e o uso é cobrado por lá.

Sem nenhum dos dois, o chat continua funcionando em "modo simples" (respostas prontas sobre vacinas, consultas, código e adoção).

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
src/store.js            sessão de login e dados da conta
src/backend/            contas: servidor (remote.js) ou aparelho (local.js)
src/screens/AdminScreen.js  página de administração
src/ai/                 regras do assistente e conexão com a IA
server/                 servidor: contas, administração e assistente com IA
src/components/         Logo, ícones (SVG), degradê, cabeçalho
src/screens/            Login, Menu, RGA e demais telas
scripts/single-html.js  junta o build web num único web/index.html
assets/                 foto do pet e quadros da animação do mascote
```
