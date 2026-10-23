# Vitrine Pro — versão 19

## Conteúdo
- `VitrinePRO_19.html`: interface da versão 19.
- `backend/VitrinePRO_19.html`: interface servida pelo backend.
- `backend/server.js`: API Node.js/Express ajustada para servir a versão 19.
- `backend/schema.sql`: estrutura do banco MySQL.
- `backend/seed.js`: dados demonstrativos.
- `backend/.env.example`: modelo de configuração, sem senhas reais.
- `RESUMO_DAS_ALTERACOES.md`: resumo compartilhável da atualização.

## Como configurar em um computador
1. Instale Node.js e MySQL.
2. Abra a pasta `backend`.
3. Execute `npm install`.
4. Copie `.env.example` para um arquivo chamado `.env`.
5. Edite `.env` e informe a senha local do MySQL e uma chave JWT longa e exclusiva. Não compartilhe o `.env`.
6. Execute `schema.sql` no MySQL para criar a estrutura do banco `vitrinepro`.
7. Opcionalmente, execute `node seed.js` para inserir os dados de demonstração. Atenção: use seed somente se desejar esses dados.
8. Execute `npm start` dentro de `backend` e acesse `http://localhost:3000`.

## Situação conhecida
A integração inicial com MySQL foi testada para login, listagem e cadastro de produto. A versão 19 inclui uma tentativa de correção no fluxo de edição para enviar `PUT /api/products/:id` quando há um ID de produto. **A edição ainda precisa ser validada no ambiente local**, assim como exclusão, cadastros e permissões de todos os perfis. Portanto, esta versão não deve ser considerada totalmente testada ou pronta para produção.

## Segurança
O ZIP não inclui `.env` nem `node_modules`. Isso evita compartilhar credenciais locais e reduz o tamanho. Cada pessoa deve criar seu próprio `.env` com credenciais próprias. Não publicar a aplicação em produção sem revisão de segurança.
