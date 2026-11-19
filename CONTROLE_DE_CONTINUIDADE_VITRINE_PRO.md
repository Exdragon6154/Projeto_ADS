# Controle de continuidade — Vitrine Pro

## Versão preparada
VitrinePRO_24, baseada no pacote V23.1 validado pelo usuário para permanência de sessão após F5 nos três perfis e alteração de senha (senha antiga recusada, nova senha aceita).

## Implementado na V24
- Revalidação do status do fornecedor para operações protegidas, inclusive com JWT emitido antes do bloqueio.
- Consulta direta de produtos limitada a fornecedores e usuários ativos.
- Tabela administrativa de clientes separada da tabela de fornecedores.
- Menu móvel recolhível para cliente, fornecedor e administrador.
- Remoção de senhas demonstrativas literais em estruturas legadas do frontend.
- Testes automatizados de regressão estática via `npm test`.

## Preservação do banco
- Nenhuma migration nova.
- Não executar `schema.sql`, `seed.js` ou migrações anteriores no banco existente.
- Preservar `backend/.env` local; ele não acompanha o ZIP.
- `node_modules` não acompanha o ZIP; instalar com `npm install` em `backend`.

## Validação pendente no computador do usuário
1. `npm run check` (inclui testes automatizados).
2. Cliente: navegar pelo menu em tela de 390 px.
3. Fornecedor ativo: criar, editar e excluir produto.
4. Fornecedor pendente/bloqueado: tentar abrir painel e executar POST/PUT/DELETE com token antigo; deve receber HTTP 403.
5. Admin: confirmar que tabela de clientes não mistura fornecedores e que aprovação/bloqueio funciona.
6. Testar navegação nos três perfis em celular.
7. Repetir login após F5 e alteração de senha, já validados na V23.1.

## Limitação
Os testes automatizados desta versão são regressões estáticas. A validação funcional de banco, API autenticada e responsividade depende do ambiente local do usuário.
