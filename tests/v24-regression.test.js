const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const server = fs.readFileSync(path.join(root, 'backend/server.js'), 'utf8');
const app = fs.readFileSync(path.join(root, 'frontend/js/app.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'frontend/index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'frontend/css/style.css'), 'utf8');

test('fornecedor pendente/bloqueado é revalidado em operações protegidas', () => {
  assert.match(server, /async function activeSupplier/);
  assert.match(server, /f\.status='ativo' AND u\.status='ativo'/);
  assert.match(server, /app\.post\('\/api\/products',auth,only\('fornecedor'\),activeSupplier/);
  assert.match(server, /app\.put\('\/api\/products\/:id',auth,only\('fornecedor'\),activeSupplier/);
  assert.match(server, /app\.delete\('\/api\/products\/:id',auth,only\('fornecedor'\),activeSupplier/);
  assert.match(server, /app\.get\('\/api\/supplier\/dashboard',auth,only\('fornecedor'\),activeSupplier/);
});

test('painel administrativo lista clientes separadamente dos fornecedores', () => {
  assert.match(server, /WHERE tipo='cliente' ORDER BY id DESC/);
  assert.match(app, /Nenhum cliente cadastrado/);
  assert.doesNotMatch(app, /<th>Perfil<\/th>/);
});

test('menu responsivo está presente nas três áreas e possui estilo móvel', () => {
  assert.equal((html.match(/class="mobile-menu-toggle"/g) || []).length, 3);
  assert.match(app, /window\.toggleMobileNav/);
  assert.match(css, /\.top-nav\.mobile-open\{display:flex\}/);
});

test('senhas demonstrativas em texto puro foram removidas do JavaScript', () => {
  assert.doesNotMatch(app, /senha\s*:\s*["']123456["']/i);
  assert.doesNotMatch(app, /senha\s*=\s*["']123456["']/i);
});

test('rotas de senha e sessão continuam presentes', () => {
  assert.match(server, /app\.patch\('\/api\/me\/password'/);
  assert.match(server, /app\.get\('\/api\/me',auth/);
  assert.match(app, /window\.login = async function/);
});
