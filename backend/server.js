require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN || true }));
app.use(express.json({ limit: '100kb' }));
const cfg = () => ({ host: process.env.DB_HOST || 'localhost', port: Number(process.env.DB_PORT || 3306), user: process.env.DB_USER || 'root', password: process.env.DB_PASSWORD || '', database: process.env.DB_NAME || 'vitrinepro' });
let pool;
const db = () => pool ||= mysql.createPool({ ...cfg(), connectionLimit: 10, decimalNumbers: true });
const JWT_SECRET = process.env.JWT_SECRET;
const PORT = Number(process.env.PORT || 3000);
function safeUser(r) { return { id:r.id,nome:r.nome,email:r.email,telefone:r.telefone,cidade:r.cidade,estado:r.estado,tipo:r.tipo,status:r.status }; }
function auth(req,res,next) {
 const h=req.headers.authorization||'', token=h.startsWith('Bearer ')?h.slice(7):'';
 if(!token) return res.status(401).json({error:'Faça login para continuar.'});
 try { req.user=jwt.verify(token,JWT_SECRET,{issuer:'vitrinepro'}); next(); }
 catch { return res.status(401).json({error:'Sessão inválida ou expirada. Entre novamente.'}); }
}
function only(...roles) { return (req,res,next)=>!req.user||!roles.includes(req.user.tipo)?res.status(403).json({error:'Você não tem permissão para esta ação.'}):next(); }
// Revalida o status do fornecedor em toda operação privilegiada, mesmo que ele ainda possua JWT válido.
async function activeSupplier(req,res,next) {
 try {
  const [rows]=await (await db()).query("SELECT f.id FROM fornecedores f JOIN usuarios u ON u.id=f.usuario_id WHERE f.usuario_id=? AND f.status='ativo' AND u.status='ativo' LIMIT 1",[req.user.id]);
  if(!rows.length)return res.status(403).json({error:'Fornecedor aguardando aprovação ou bloqueado. Esta operação não está disponível.'});
  req.supplierId=rows[0].id; next();
 } catch(e) { console.error('Supplier authorization:',e.code); return res.status(500).json({error:'Não foi possível validar o status do fornecedor.'}); }
}
async function supplierForUser(id) { const [r]=await (await db()).query("SELECT id FROM fornecedores WHERE usuario_id=? AND status='ativo'",[id]); return r[0]?.id; }
async function logAdmin(adminId,text) { await (await db()).query('INSERT INTO logs_admin (admin_id,texto) VALUES (?,?)',[adminId||null,String(text).slice(0,255)]); }
async function notifyAdmins(tipo,titulo,mensagem) { await (await db()).query('INSERT INTO notificacoes (tipo,titulo,mensagem) VALUES (?,?,?)',[tipo,titulo,mensagem]); }
function positiveInt(v) { const n=Number(v); return Number.isSafeInteger(n)&&n>0?n:null; }
function validProduct(x) { return x&&typeof x.nome==='string'&&x.nome.trim()&&typeof x.marca==='string'&&x.marca.trim()&&typeof x.modelo==='string'&&x.modelo.trim()&&Number.isFinite(Number(x.preco))&&Number(x.preco)>=0&&Number.isSafeInteger(Number(x.estoque))&&Number(x.estoque)>=0; }
const FRONTEND_DIR = path.join(__dirname, '..', 'frontend');
app.use(express.static(FRONTEND_DIR));
app.get('/',(req,res)=>res.sendFile(path.join(FRONTEND_DIR,'index.html')));
app.get('/api/health',async(req,res)=>{try{await(await db()).query('SELECT 1');res.json({ok:true,database:true});}catch(e){console.error('Health:',e.code);res.status(503).json({ok:false,error:'Banco de dados indisponível.'});}});
app.post('/api/login',async(req,res)=>{try{
 const email=String(req.body?.email||'').trim(),senha=String(req.body?.senha||''),tipo=String(req.body?.tipo||'');
 if(!email||!senha||!['cliente','fornecedor','admin'].includes(tipo))return res.status(400).json({error:'Informe e-mail, senha e perfil válidos.'});
 const [rows]=await(await db()).query('SELECT * FROM usuarios WHERE LOWER(email)=LOWER(?) AND tipo=? LIMIT 1',[email,tipo]);
 if(!rows.length||!(await bcrypt.compare(senha,rows[0].senha_hash)))return res.status(401).json({error:'E-mail ou senha inválidos.'});
 const u=rows[0];if(u.status!=='ativo')return res.status(403).json({error:'Esta conta não está ativa. Entre em contato com o administrador.'});
 const token=jwt.sign({id:u.id,tipo:u.tipo},JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN||'8h',issuer:'vitrinepro'});
 let user=safeUser(u);
 if(tipo==='fornecedor'){const [s]=await(await db()).query('SELECT id AS fornecedor_id,usuario_id,empresa,responsavel,cnpj,endereco,cidade,estado,descricao,status AS status_fornecedor FROM fornecedores WHERE usuario_id=?',[u.id]);if(!s.length||s[0].status_fornecedor!=='ativo')return res.status(403).json({error:'Seu cadastro de fornecedor ainda está em análise ou bloqueado. Aguarde a aprovação do administrador.'});user={...user,...s[0]};}
 res.json({user,token,expiresIn:process.env.JWT_EXPIRES_IN||'8h'});
 }catch(e){console.error('Login:',e.code);res.status(500).json({error:'Não foi possível realizar o login.'});}});
app.get('/api/me',auth,async(req,res)=>{try{
 const [rows]=await(await db()).query('SELECT * FROM usuarios WHERE id=? LIMIT 1',[req.user.id]);
 if(!rows.length||rows[0].status!=='ativo')return res.status(401).json({error:'Conta não encontrada ou bloqueada.'});
 let user=safeUser(rows[0]);
 if(user.tipo==='fornecedor'){const [s]=await(await db()).query('SELECT id AS fornecedor_id,usuario_id,empresa,responsavel,cnpj,endereco,cidade,estado,descricao,status AS status_fornecedor FROM fornecedores WHERE usuario_id=?',[user.id]);if(!s.length||s[0].status_fornecedor!=='ativo')return res.status(403).json({error:'Cadastro de fornecedor ainda não aprovado ou bloqueado.'});user={...user,...s[0]};}
 res.json({user});
 }catch(e){console.error('Me:',e.code);res.status(500).json({error:'Não foi possível restaurar a sessão.'});}});
app.patch('/api/me/password',auth,async(req,res)=>{try{
 const current=String(req.body?.currentPassword||''),next=String(req.body?.newPassword||'');
 if(!current||next.length<6)return res.status(400).json({error:'Informe a senha atual e uma nova senha com pelo menos 6 caracteres.'});
 const [rows]=await(await db()).query('SELECT senha_hash FROM usuarios WHERE id=? LIMIT 1',[req.user.id]);
 if(!rows.length||!(await bcrypt.compare(current,rows[0].senha_hash)))return res.status(401).json({error:'A senha atual está incorreta.'});
 const hash=await bcrypt.hash(next,12);await(await db()).query('UPDATE usuarios SET senha_hash=? WHERE id=?',[hash,req.user.id]);
 res.json({ok:true,message:'Senha alterada com sucesso.'});
 }catch(e){console.error('Password:',e.code);res.status(500).json({error:'Não foi possível alterar a senha.'});}});
app.patch('/api/me/profile',auth,async(req,res)=>{try{
 const x=req.body||{};
 const nome=String(x.nome||'').trim(),telefone=String(x.telefone||'').trim(),cidade=String(x.cidade||'').trim(),estado=String(x.estado||'').trim().toUpperCase();
 if(!nome)return res.status(400).json({error:'Informe o nome ou responsável.'});
 await(await db()).query('UPDATE usuarios SET nome=?,telefone=?,cidade=?,estado=? WHERE id=?',[nome,telefone,cidade,estado,req.user.id]);
 let supplier=null;
 if(req.user.tipo==='fornecedor'){
  const responsavel=String(x.responsavel||nome).trim();
  const cnpj=String(x.cnpj||'').trim(),endereco=String(x.endereco||'').trim(),descricao=String(x.descricao||'').trim();
  const [r]=await(await db()).query('UPDATE fornecedores SET responsavel=?,cnpj=?,endereco=?,cidade=?,estado=?,descricao=? WHERE usuario_id=?',[responsavel,cnpj,endereco,cidade,estado,descricao,req.user.id]);
  if(!r.affectedRows)return res.status(404).json({error:'Cadastro de fornecedor não encontrado para esta conta.'});
  const [rows]=await(await db()).query('SELECT id AS fornecedor_id,empresa,responsavel,cnpj,endereco,cidade,estado,descricao FROM fornecedores WHERE usuario_id=?',[req.user.id]);supplier=rows[0]||null;
 }
 const [users]=await(await db()).query('SELECT id,nome,email,telefone,cidade,estado,tipo,status FROM usuarios WHERE id=?',[req.user.id]);
 res.json({ok:true,user:users[0],supplier});
 }catch(e){console.error('Profile:',e.code);res.status(500).json({error:'Não foi possível salvar as configurações da conta.'});}});

app.post('/api/clients',async(req,res)=>{try{
 const {nome,email,telefone,cidade,estado,senha}=req.body||{};
 if(![nome,email,senha].every(v=>typeof v==='string'&&v.trim())||senha.length<6)return res.status(400).json({error:'Informe nome, e-mail e senha com pelo menos 6 caracteres.'});
 const hash=await bcrypt.hash(senha,12);
 const [r]=await(await db()).query("INSERT INTO usuarios (nome,email,senha_hash,telefone,cidade,estado,tipo) VALUES (?,?,?,?,?,?,'cliente')",[nome.trim(),email.trim().toLowerCase(),hash,telefone||'',cidade||'',String(estado||'').toUpperCase()]);
 res.status(201).json({user:{id:r.insertId,nome:nome.trim(),email:email.trim().toLowerCase(),tipo:'cliente',status:'ativo'}});
 }catch(e){res.status(e.code==='ER_DUP_ENTRY'?409:500).json({error:e.code==='ER_DUP_ENTRY'?'E-mail já cadastrado.':'Não foi possível criar a conta.'});}});
app.post('/api/suppliers',async(req,res)=>{const x=req.body||{};
 if(![x.responsavel,x.empresa,x.email,x.senha].every(v=>typeof v==='string'&&v.trim())||x.senha.length<6)return res.status(400).json({error:'Informe responsável, empresa, e-mail e senha com pelo menos 6 caracteres.'});
 const c=await(await db()).getConnection();try{await c.beginTransaction();const hash=await bcrypt.hash(x.senha,12);
 const [u]=await c.query("INSERT INTO usuarios (nome,email,senha_hash,telefone,cidade,estado,tipo) VALUES (?,?,?,?,?,?,'fornecedor')",[x.responsavel.trim(),x.email.trim().toLowerCase(),hash,x.telefone||'',x.cidade||'',String(x.estado||'').toUpperCase()]);
 const [s]=await c.query("INSERT INTO fornecedores (usuario_id,empresa,responsavel,cnpj,endereco,cidade,estado,descricao,status) VALUES (?,?,?,?,?,?,?,?, 'em_analise')",[u.insertId,x.empresa.trim(),x.responsavel.trim(),x.cnpj||'',x.endereco||'',x.cidade||'',String(x.estado||'').toUpperCase(),x.descricao||'']);
 await c.commit();try{await notifyAdmins('fornecedor','Novo fornecedor aguardando aprovação',String(x.empresa||'Fornecedor')+' solicitou cadastro.');}catch(e){console.error('Notification:',e.code);}res.status(201).json({id:s.insertId,usuario_id:u.insertId,empresa:x.empresa,status:'em_analise'});
 }catch(e){await c.rollback();res.status(e.code==='ER_DUP_ENTRY'?409:500).json({error:e.code==='ER_DUP_ENTRY'?'E-mail já cadastrado.':'Não foi possível cadastrar o fornecedor.'});}finally{c.release();}});
app.get('/api/catalog',async(req,res)=>{try{const p=await db();
 const [suppliers]=await p.query("SELECT f.id,f.empresa,f.responsavel,f.cnpj,f.endereco,f.cidade,f.estado,f.descricao,f.status,u.email,u.telefone FROM fornecedores f JOIN usuarios u ON u.id=f.usuario_id WHERE f.status='ativo' AND u.status='ativo' ORDER BY f.empresa");
 const [products]=await p.query("SELECT p.*,p.fornecedor_id AS supplierId FROM produtos p JOIN fornecedores f ON f.id=p.fornecedor_id JOIN usuarios u ON u.id=f.usuario_id WHERE f.status='ativo' AND u.status='ativo' ORDER BY p.id");
 res.json({suppliers,products});}catch(e){console.error('Catalog:',e.code);res.status(500).json({error:'Não foi possível carregar o catálogo.'});}});
app.get('/api/suppliers/:id/products',async(req,res)=>{try{const id=positiveInt(req.params.id);if(!id)return res.status(400).json({error:'Fornecedor inválido.'});const [r]=await(await db()).query("SELECT p.*,p.fornecedor_id AS supplierId FROM produtos p JOIN fornecedores f ON f.id=p.fornecedor_id JOIN usuarios u ON u.id=f.usuario_id WHERE p.fornecedor_id=? AND f.status='ativo' AND u.status='ativo' ORDER BY p.id",[id]);res.json(r);}catch{res.status(500).json({error:'Não foi possível carregar os produtos.'});}});
app.post('/api/products',auth,only('fornecedor'),activeSupplier,async(req,res)=>{try{const x=req.body||{};if(!validProduct(x))return res.status(400).json({error:'Confira nome, marca, modelo, preço e estoque.'});const sid=req.supplierId;
 const [r]=await(await db()).query('INSERT INTO produtos (fornecedor_id,nome,categoria,marca,modelo,preco,estoque,tamanho,cor,descricao,emoji) VALUES (?,?,?,?,?,?,?,?,?,?,?)',[sid,x.nome.trim(),x.categoria||x.nome,x.marca.trim(),x.modelo.trim(),Number(x.preco),Number(x.estoque),x.tamanho||'',x.cor||'',x.descricao||'',x.emoji||'📦']);
 const [rows]=await(await db()).query('SELECT *,fornecedor_id AS supplierId FROM produtos WHERE id=?',[r.insertId]);res.status(201).json(rows[0]);}catch(e){console.error('Create product:',e.code);res.status(500).json({error:'Não foi possível cadastrar o produto.'});}});
app.put('/api/products/:id',auth,only('fornecedor'),activeSupplier,async(req,res)=>{try{const id=positiveInt(req.params.id),x=req.body||{};if(!id||!validProduct(x))return res.status(400).json({error:'Produto inválido.'});const sid=req.supplierId;
 const [r]=await(await db()).query('UPDATE produtos SET nome=?,categoria=?,marca=?,modelo=?,preco=?,estoque=?,tamanho=?,cor=?,descricao=?,emoji=? WHERE id=? AND fornecedor_id=?',[x.nome.trim(),x.categoria||x.nome,x.marca.trim(),x.modelo.trim(),Number(x.preco),Number(x.estoque),x.tamanho||'',x.cor||'',x.descricao||'',x.emoji||'📦',id,sid]);
 if(!r.affectedRows)return res.status(404).json({error:'Produto não encontrado neste fornecedor.'});const [rows]=await(await db()).query('SELECT *,fornecedor_id AS supplierId FROM produtos WHERE id=?',[id]);res.json(rows[0]);
 }catch{res.status(500).json({error:'Não foi possível atualizar o produto.'});}});
app.delete('/api/products/:id',auth,only('fornecedor'),activeSupplier,async(req,res)=>{try{const id=positiveInt(req.params.id);if(!id)return res.status(400).json({error:'Produto inválido.'});const sid=req.supplierId;
 const [r]=await(await db()).query('DELETE FROM produtos WHERE id=? AND fornecedor_id=?',[id,sid]);if(!r.affectedRows)return res.status(404).json({error:'Produto não encontrado neste fornecedor.'});res.json({ok:true});
 }catch{res.status(500).json({error:'Não foi possível excluir o produto.'});}});
app.get('/api/favorites/:clientId',auth,only('cliente'),async(req,res)=>{try{if(Number(req.params.clientId)!==req.user.id)return res.status(403).json({error:'Acesso negado.'});const [r]=await(await db()).query('SELECT id,produto_id,fornecedor_id FROM favoritos WHERE cliente_id=?',[req.user.id]);res.json({products:r.filter(x=>x.produto_id).map(x=>x.produto_id),suppliers:r.filter(x=>x.fornecedor_id).map(x=>x.fornecedor_id)});}catch{res.status(500).json({error:'Não foi possível carregar os favoritos.'});}});
app.post('/api/favorites',auth,only('cliente'),async(req,res)=>{try{const {produto_id,fornecedor_id}=req.body||{};if(!!produto_id===!!fornecedor_id)return res.status(400).json({error:'Favorito inválido.'});const p=await db();
 if(produto_id){const id=positiveInt(produto_id);if(!id)return res.status(400).json({error:'Produto inválido.'});const [q]=await p.query('SELECT id FROM favoritos WHERE cliente_id=? AND produto_id=?',[req.user.id,id]);if(q.length)await p.query('DELETE FROM favoritos WHERE id=?',[q[0].id]);else await p.query('INSERT INTO favoritos (cliente_id,produto_id) VALUES (?,?)',[req.user.id,id]);}
 else{const id=positiveInt(fornecedor_id);if(!id)return res.status(400).json({error:'Fornecedor inválido.'});const [q]=await p.query('SELECT id FROM favoritos WHERE cliente_id=? AND fornecedor_id=?',[req.user.id,id]);if(q.length)await p.query('DELETE FROM favoritos WHERE id=?',[q[0].id]);else await p.query('INSERT INTO favoritos (cliente_id,fornecedor_id) VALUES (?,?)',[req.user.id,id]);}res.json({ok:true});
 }catch{res.status(500).json({error:'Não foi possível atualizar os favoritos.'});}});
app.post('/api/orders',auth,only('cliente'),async(req,res)=>{const items=req.body?.items;const code=String(req.body?.codigo||('VP-'+Date.now())).replace(/[^A-Za-z0-9-]/g,'').slice(0,20);
 if(!Array.isArray(items)||!items.length||items.length>100)return res.status(400).json({error:'O pedido deve conter de 1 a 100 itens.'});
 const list=[];for(const i of items){const id=positiveInt(i?.produto_id),q=positiveInt(i?.quantidade);if(!id||!q)return res.status(400).json({error:'Produto ou quantidade inválidos.'});list.push({id,q});}
 const c=await(await db()).getConnection();try{await c.beginTransaction();let total=0;const details=[];
 for(let i=0;i<list.length;i++){const item=list[i];const [r]=await c.query('SELECT id,fornecedor_id,modelo,preco,estoque FROM produtos WHERE id=? FOR UPDATE',[item.id]);if(!r.length)throw Object.assign(new Error('Produto não encontrado.'),{status:404});const p=r[0];if(Number(p.estoque)<item.q)throw Object.assign(new Error('Estoque insuficiente para '+p.modelo+'.'),{status:409});
 const subtotal=Number(p.preco)*item.q;total+=subtotal;await c.query('UPDATE produtos SET estoque=estoque-? WHERE id=? AND estoque>=?',[item.q,item.id,item.q]);
 await c.query('INSERT INTO interesses (codigo,cliente_id,produto_id,fornecedor_id,quantidade,valor_unitario,valor_total) VALUES (?,?,?,?,?,?,?)',[(code+'-'+(i+1)).slice(0,30),req.user.id,p.id,p.fornecedor_id,item.q,p.preco,subtotal]);
 details.push({produto_id:p.id,produto:p.modelo,quantidade:item.q,valor_unitario:Number(p.preco),subtotal});}
 await c.commit();try{await notifyAdmins('pedido','Novo pedido simulado','Pedido '+code+' registrado.');}catch(e){console.error('Notification:',e.code);}res.status(201).json({ok:true,codigo:code,total:Number(total.toFixed(2)),items:details,message:'Pedido simulado e registrado com sucesso.'});
 }catch(e){await c.rollback();res.status(e.status||500).json({error:e.status?e.message:'Não foi possível registrar o pedido.'});}finally{c.release();}});
app.get('/api/orders/mine',auth,only('cliente'),async(req,res)=>{try{const [r]=await(await db()).query('SELECT i.*,p.modelo AS produto,f.empresa AS fornecedor FROM interesses i JOIN produtos p ON p.id=i.produto_id JOIN fornecedores f ON f.id=i.fornecedor_id WHERE i.cliente_id=? ORDER BY i.criado_em DESC',[req.user.id]);res.json(r);}catch{res.status(500).json({error:'Não foi possível carregar seus pedidos.'});}});
app.get('/api/supplier/dashboard',auth,only('fornecedor'),activeSupplier,async(req,res)=>{try{const sid=req.supplierId;const p=await db();const [[stats]]=await p.query('SELECT COUNT(*) AS products,COALESCE(SUM(estoque),0) AS stock FROM produtos WHERE fornecedor_id=?',[sid]);const [products]=await p.query('SELECT * FROM produtos WHERE fornecedor_id=? ORDER BY id DESC',[sid]);const [interests]=await p.query('SELECT i.*,p.modelo AS produto,u.nome AS cliente FROM interesses i JOIN produtos p ON p.id=i.produto_id JOIN usuarios u ON u.id=i.cliente_id WHERE i.fornecedor_id=? ORDER BY i.criado_em DESC',[sid]);res.json({stats,products,interests});}catch{res.status(500).json({error:'Não foi possível carregar o painel do fornecedor.'});}});
app.get('/api/admin/dashboard',auth,only('admin'),async(req,res)=>{try{const p=await db();const [[c]]=await p.query("SELECT COUNT(*) n FROM usuarios WHERE tipo='cliente'");const [[s]]=await p.query('SELECT COUNT(*) n FROM fornecedores');const [[pr]]=await p.query('SELECT COUNT(*) n FROM produtos');const [[st]]=await p.query('SELECT COALESCE(SUM(estoque),0) n FROM produtos');const [[orders]]=await p.query("SELECT COUNT(DISTINCT SUBSTRING_INDEX(codigo,'-',2)) n FROM interesses");
 const [users]=await p.query("SELECT id,nome,email,status,criado_em FROM usuarios WHERE tipo='cliente' ORDER BY id DESC");const [suppliers]=await p.query('SELECT f.*,u.email,u.telefone,u.status AS usuario_status FROM fornecedores f JOIN usuarios u ON u.id=f.usuario_id ORDER BY f.id DESC');const [products]=await p.query('SELECT p.*,f.empresa AS fornecedor FROM produtos p JOIN fornecedores f ON f.id=p.fornecedor_id ORDER BY p.id DESC');const [interests]=await p.query('SELECT i.*,u.nome AS cliente,p.modelo AS produto,f.empresa AS fornecedor FROM interesses i JOIN usuarios u ON u.id=i.cliente_id JOIN produtos p ON p.id=i.produto_id JOIN fornecedores f ON f.id=i.fornecedor_id ORDER BY i.id DESC');const [[pending]]=await p.query("SELECT COUNT(*) n FROM fornecedores WHERE status='em_analise'");res.json({stats:{clients:c.n,suppliers:s.n,products:pr.n,stock:st.n,orders:orders.n,pending:pending.n},users,suppliers,products,interests});
 }catch{res.status(500).json({error:'Não foi possível carregar o painel administrativo.'});}});
app.patch('/api/admin/users/:id/status',auth,only('admin'),async(req,res)=>{try{const id=positiveInt(req.params.id),status=req.body?.status;if(!id||!['ativo','bloqueado'].includes(status))return res.status(400).json({error:'Usuário ou status inválido.'});if(id===req.user.id)return res.status(400).json({error:'Não é permitido bloquear a própria conta.'});
 const [r]=await(await db()).query("UPDATE usuarios SET status=? WHERE id=? AND tipo<>'admin'",[status,id]);if(!r.affectedRows)return res.status(404).json({error:'Usuário não encontrado.'});await(await db()).query('UPDATE fornecedores SET status=? WHERE usuario_id=?',[status==='bloqueado'?'bloqueado':'ativo',id]);await logAdmin(req.user.id,'Status do usuário #'+id+' alterado para '+status);res.json({ok:true,id,status});
 }catch{res.status(500).json({error:'Não foi possível alterar o status.'});}});
app.patch('/api/admin/suppliers/:id/status',auth,only('admin'),async(req,res)=>{try{const id=positiveInt(req.params.id),status=req.body?.status;if(!id||!['ativo','em_analise','bloqueado'].includes(status))return res.status(400).json({error:'Fornecedor ou status inválido.'});
 const [r]=await(await db()).query('UPDATE fornecedores SET status=? WHERE id=?',[status,id]);if(!r.affectedRows)return res.status(404).json({error:'Fornecedor não encontrado.'});await(await db()).query('UPDATE usuarios SET status=? WHERE id=(SELECT usuario_id FROM fornecedores WHERE id=?)',[status==='bloqueado'?'bloqueado':'ativo',id]);await logAdmin(req.user.id,'Status do fornecedor #'+id+' alterado para '+status);if(status==='ativo')await notifyAdmins('aprovacao','Fornecedor aprovado','Fornecedor #'+id+' foi aprovado.');res.json({ok:true,id,status});
 }catch{res.status(500).json({error:'Não foi possível alterar o status do fornecedor.'});}});
app.delete('/api/admin/users/:id',auth,only('admin'),async(req,res)=>{try{
 const id=positiveInt(req.params.id);if(!id||id===req.user.id)return res.status(400).json({error:'Usuário inválido.'});
 const [r]=await(await db()).query("DELETE FROM usuarios WHERE id=? AND tipo<>'admin'",[id]);
 if(!r.affectedRows)return res.status(404).json({error:'Usuário não encontrado.'});
 await logAdmin(req.user.id,'Usuário #'+id+' removido');res.json({ok:true,id});
 }catch(e){console.error('Delete user:',e.code);res.status(500).json({error:'Não foi possível remover o usuário.'});}});
app.delete('/api/admin/suppliers/:id',auth,only('admin'),async(req,res)=>{try{
 const id=positiveInt(req.params.id);if(!id)return res.status(400).json({error:'Fornecedor inválido.'});
 const [r]=await(await db()).query('DELETE FROM fornecedores WHERE id=?',[id]);
 if(!r.affectedRows)return res.status(404).json({error:'Fornecedor não encontrado.'});
 await logAdmin(req.user.id,'Fornecedor #'+id+' removido');res.json({ok:true,id});
 }catch(e){console.error('Delete supplier:',e.code);res.status(500).json({error:'Não foi possível remover o fornecedor.'});}});
app.get('/api/admin/notifications',auth,only('admin'),async(req,res)=>{try{const [rows]=await(await db()).query('SELECT id,tipo,titulo,mensagem,lida,criado_em FROM notificacoes WHERE admin_id IS NULL OR admin_id=? ORDER BY criado_em DESC LIMIT 100',[req.user.id]);res.json(rows);}catch(e){console.error('Notifications:',e.code);res.status(500).json({error:'Não foi possível carregar notificações.'});}});
app.patch('/api/admin/notifications/:id/read',auth,only('admin'),async(req,res)=>{try{const id=positiveInt(req.params.id);if(!id)return res.status(400).json({error:'Notificação inválida.'});const [r]=await(await db()).query('UPDATE notificacoes SET lida=1 WHERE id=? AND (admin_id IS NULL OR admin_id=?)',[id,req.user.id]);if(!r.affectedRows)return res.status(404).json({error:'Notificação não encontrada.'});res.json({ok:true,id});}catch{res.status(500).json({error:'Não foi possível atualizar a notificação.'});}});
app.get('/api/admin/logs',auth,only('admin'),async(req,res)=>{try{const [rows]=await(await db()).query('SELECT l.id,l.texto,l.criado_em,u.nome AS administrador FROM logs_admin l LEFT JOIN usuarios u ON u.id=l.admin_id ORDER BY l.criado_em DESC LIMIT 200');res.json(rows);}catch{res.status(500).json({error:'Não foi possível carregar o histórico.'});}});
app.get('/api/admin/reports',auth,only('admin'),async(req,res)=>{try{const p=await db();const [monthly]=await p.query("SELECT DATE_FORMAT(criado_em,'%Y-%m') AS periodo,COUNT(DISTINCT SUBSTRING_INDEX(codigo,'-',2)) AS pedidos,COALESCE(SUM(valor_total),0) AS total_simulado FROM interesses WHERE criado_em >= DATE_SUB(CURDATE(),INTERVAL 6 MONTH) GROUP BY DATE_FORMAT(criado_em,'%Y-%m') ORDER BY periodo");const [topSuppliers]=await p.query('SELECT f.empresa,COUNT(i.id) AS itens_pedidos,COALESCE(SUM(i.quantidade),0) AS unidades FROM fornecedores f LEFT JOIN interesses i ON i.fornecedor_id=f.id GROUP BY f.id,f.empresa ORDER BY unidades DESC LIMIT 10');const [[totals]]=await p.query("SELECT COUNT(DISTINCT SUBSTRING_INDEX(codigo,'-',2)) AS pedidos,COALESCE(SUM(valor_total),0) AS total_simulado,COALESCE(SUM(quantidade),0) AS unidades FROM interesses");res.json({monthly,topSuppliers,totals});}catch(e){console.error('Reports:',e.code);res.status(500).json({error:'Não foi possível gerar relatórios.'});}});
app.delete('/api/admin/products/:id',auth,only('admin'),async(req,res)=>{try{const id=positiveInt(req.params.id);if(!id)return res.status(400).json({error:'Produto inválido.'});const [r]=await(await db()).query('DELETE FROM produtos WHERE id=?',[id]);if(!r.affectedRows)return res.status(404).json({error:'Produto não encontrado.'});await logAdmin(req.user.id,'Produto #'+id+' removido');res.json({ok:true,id});}catch{res.status(500).json({error:'Não foi possível remover o produto.'});}});
app.get('/api/admin/clients',auth,only('admin'),async(req,res)=>{try{const [r]=await(await db()).query("SELECT id,nome,email,telefone,cidade,estado,status FROM usuarios WHERE tipo='cliente' ORDER BY id");res.json(r);}catch{res.status(500).json({error:'Não foi possível carregar os clientes.'});}});
app.use((err,req,res,next)=>{console.error('Erro API:',err.code||err.name||'Error');if(res.headersSent)return next(err);res.status(400).json({error:'Requisição inválida.'});});
app.listen(PORT,()=>console.log('Vitrine Pro API rodando em http://localhost:'+PORT));
