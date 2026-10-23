# Vitrine Pro — VitrinePRO_19

**Data:** 23/10/2026

## Alterações incluídas
- Incluído o arquivo de interface `VitrinePRO_19.html` na raiz e em `backend/`.
- Atualizado `backend/server.js` para servir `VitrinePRO_19.html`.
- Mantida a API de produtos com rotas de cadastro (`POST /api/products`), edição (`PUT /api/products/:id`) e exclusão (`DELETE /api/products/:id`).
- A interface da versão 19 tenta usar o ID do produto ao editar e enviar uma requisição `PUT`, em vez de criar um novo produto.
- Incluídas instruções de configuração e um modelo `.env.example` sem credenciais reais.
- Removidos do pacote `.env` privado e `node_modules`; as dependências devem ser instaladas com `npm install`.

## Testes já relatados
- Conexão com o MySQL utilizada durante os testes.
- Login testado.
- Listagem de produtos do fornecedor Carlos exibida corretamente.
- Cadastro de um produto de teste gravado no MySQL.

## Pendente
- Confirmar que a edição atualiza o mesmo registro sem duplicar produto.
- Testar exclusão e todos os fluxos de clientes, fornecedores e administrador.
- Validar o projeto em outro computador com configuração própria do MySQL.

**Observação:** esta é uma versão de trabalho para teste/compartilhamento, não uma declaração de que todas as funções foram validadas.
