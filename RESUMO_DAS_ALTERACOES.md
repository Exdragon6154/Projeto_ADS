# VitrinePRO_24 — Resumo das alterações

## Base
Consolidada a partir da V23.1, que já continha restauração de sessão após F5 e alteração de senha persistida no MySQL.

## Alterações desta versão
- Revalidação do status do fornecedor no backend em operações de catálogo, produtos e painel; token antigo não libera ações após bloqueio ou retorno à análise.
- Endpoint de produtos de fornecedor exibe somente produtos de fornecedores ativos.
- Painel administrativo: tabela de usuários passa a listar somente clientes; fornecedores permanecem em tabela própria.
- Navegação móvel: menu recolhível nas áreas de cliente, fornecedor e administrador.
- Removidos valores de senha demonstrativos em texto puro das estruturas legadas do JavaScript. O login oficial continua validado pela API/MySQL.
- Criados testes automatizados de regressão estática para autorização, separação das tabelas, menu móvel, credenciais demonstrativas e rotas de sessão/senha.

## Limites da validação
Os testes automatizados verificam estrutura e presença das proteções no código; não substituem testes end-to-end com MySQL e navegador. Não foi possível executar banco real nesta preparação.
