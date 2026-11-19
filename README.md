# Vitrine Pro — VitrinePRO_24

## Estrutura
- `frontend/`: interface HTML, CSS e JavaScript.
- `backend/`: API Node.js/Express e integração MySQL.
- `tests/`: testes automatizados de regressão estática.

## Atualização
1. Faça backup da pasta em uso.
2. Extraia o ZIP da V24 em uma nova pasta `VitrinePRO_24`.
3. Copie o seu `backend/.env` da versão anterior para `VitrinePRO_24/backend/.env`. O arquivo não é distribuído.
4. Abra o terminal em `VitrinePRO_24/backend` e execute `npm install`.
5. Execute `npm run check` e depois `npm start`.
6. Acesse `http://localhost:3000`.

## O que há na V24
- Sessão restaurada após F5 e alteração de senha persistida em MySQL (herdadas e validadas na V23.1).
- Bloqueio de operações de fornecedor quando o cadastro não está ativo, inclusive com token anterior à mudança de status.
- Painel administrativo com clientes e fornecedores em listas separadas.
- Menu de navegação recolhível em telas menores.
- Testes automatizados de regressão estática.

## Banco e credenciais
Não executar `schema.sql`, `seed.js` ou migrations antigas sobre o banco já utilizado. Nenhuma migração é necessária para a V24. Preserve os dados existentes. Nunca compartilhe `backend/.env`.

## Observação sobre testes
`npm run check` valida a sintaxe do backend/frontend e executa os testes estáticos. Os testes reais de login, MySQL, permissões e interface precisam ser feitos com o banco local ativo.
