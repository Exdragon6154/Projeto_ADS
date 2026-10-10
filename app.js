/* ==========================================================
   VITRINE PRO - Protótipo
   Estrutura preparada para futuras versões:
   - autenticação real/API
   - MySQL
   - upload de imagens
   - permissões
   - novos filtros
   - carrinho/pedidos
========================================================== */

const CLIENTS_DB = [
  {
    id: 1,
    nome: "João Silva",
    email: "joao.cliente@vitrinepro.com",
    senha: "123456",
    telefone: "(12) 99999-1001",
    cidade: "Jacareí",
    estado: "SP"
  },
  {
    id: 2,
    nome: "Mariana Oliveira",
    email: "mariana.cliente@vitrinepro.com",
    senha: "123456",
    telefone: "(12) 99999-1002",
    cidade: "São José dos Campos",
    estado: "SP"
  }
];

try {
  const savedClients = JSON.parse(localStorage.getItem("vitrineClientsDB") || "[]");
  if (Array.isArray(savedClients)) {
    savedClients.forEach(saved => {
      if (!CLIENTS_DB.some(c => String(c.email).toLowerCase() === String(saved.email || "").toLowerCase())) CLIENTS_DB.push(saved);
    });
  }
} catch (e) { console.warn("Banco local de clientes inválido."); }

let SUPPLIERS_DB = null;
try { SUPPLIERS_DB = JSON.parse(localStorage.getItem("vitrineSuppliersDB") || "null"); }
catch (e) { console.warn("Banco local de fornecedores inválido. Será recriado."); }
if(!Array.isArray(SUPPLIERS_DB) || !SUPPLIERS_DB.length){
  SUPPLIERS_DB = [
    {id:1,empresa:"Vitrine Sports Distribuidora",responsavel:"Carlos Mendes",email:"carlos.fornecedor@vitrinepro.com",senha:"123456",telefone:"(12) 98888-2001",cidade:"Jacareí",estado:"SP",cnpj:"12.345.678/0001-90",endereco:"Av. Principal, 100 - Centro, Jacareí - SP",descricao:"Distribuidora de produtos esportivos para demonstração."},
    {id:2,empresa:"Moda & Esporte Distribuidora",responsavel:"Fernanda Costa",email:"fernanda.fornecedor@vitrinepro.com",senha:"123456",telefone:"(12) 98888-2002",cidade:"São José dos Campos",estado:"SP",cnpj:"98.765.432/0001-10",endereco:"Rua das Flores, 250 - Centro, São José dos Campos - SP",descricao:"Fornecedor de moda e produtos esportivos para demonstração."}
  ];
  localStorage.setItem("vitrineSuppliersDB", JSON.stringify(SUPPLIERS_DB));
}

const DEFAULT_PRODUCTS = [
  {id:1, supplierId:1, name:"Tênis", category:"Tênis", brand:"NIKE", model:"Tênis Esportivo Air", price:499.90, stock:18, size:"40", color:"Preto", description:"Tênis esportivo fictício para demonstração.", emoji:"👟"},
  {id:2, supplierId:1, name:"Tênis", category:"Tênis", brand:"PUMA", model:"Tênis Running Active", price:389.90, stock:12, size:"41", color:"Cinza", description:"Tênis para corrida fictício.", emoji:"👟"},
  {id:3, supplierId:1, name:"Tênis", category:"Tênis", brand:"ADIDAS", model:"Tênis Performance Run", price:429.90, stock:20, size:"40", color:"Branco", description:"Tênis esportivo fictício.", emoji:"👟"},
  {id:4, supplierId:1, name:"Tênis", category:"Tênis", brand:"NEW BALANCE", model:"Tênis Comfort 574", price:459.90, stock:9, size:"42", color:"Azul", description:"Tênis casual fictício.", emoji:"👟"},
  {id:5, supplierId:1, name:"Tênis", category:"Tênis", brand:"CALVIN KLEIN", model:"Tênis Urban Classic", price:519.90, stock:7, size:"41", color:"Branco", description:"Tênis casual fictício.", emoji:"👟"},

  {id:6, supplierId:2, name:"Calça", category:"Calça", brand:"NIKE", model:"Calça Sports Essential", price:279.90, stock:15, size:"M", color:"Preto", description:"Calça esportiva fictícia.", emoji:"👖"},
  {id:7, supplierId:2, name:"Calça", category:"Calça", brand:"PUMA", model:"Calça Active Training", price:239.90, stock:11, size:"G", color:"Cinza", description:"Calça esportiva fictícia.", emoji:"👖"},
  {id:8, supplierId:2, name:"Calça", category:"Calça", brand:"ADIDAS", model:"Calça Performance Basic", price:259.90, stock:16, size:"M", color:"Preto", description:"Calça esportiva fictícia.", emoji:"👖"},
  {id:9, supplierId:2, name:"Calça", category:"Calça", brand:"NEW BALANCE", model:"Calça Comfort Fit", price:289.90, stock:8, size:"G", color:"Marinho", description:"Calça casual fictícia.", emoji:"👖"},
  {id:10, supplierId:2, name:"Calça", category:"Calça", brand:"CALVIN KLEIN", model:"Calça Jeans Classic", price:349.90, stock:6, size:"42", color:"Azul", description:"Calça jeans fictícia.", emoji:"👖"},

  {id:11, supplierId:1, name:"Shorts", category:"Shorts", brand:"NIKE", model:"Shorts Dri-Fit Sport", price:159.90, stock:24, size:"M", color:"Preto", description:"Shorts esportivo fictício.", emoji:"🩳"},
  {id:12, supplierId:1, name:"Shorts", category:"Shorts", brand:"PUMA", model:"Shorts Active Run", price:139.90, stock:19, size:"G", color:"Azul", description:"Shorts para atividades esportivas fictício.", emoji:"🩳"},
  {id:13, supplierId:1, name:"Shorts", category:"Shorts", brand:"ADIDAS", model:"Shorts Training Basic", price:149.90, stock:22, size:"M", color:"Cinza", description:"Shorts esportivo fictício.", emoji:"🩳"},
  {id:14, supplierId:1, name:"Shorts", category:"Shorts", brand:"NEW BALANCE", model:"Shorts Performance", price:169.90, stock:13, size:"G", color:"Preto", description:"Shorts esportivo fictício.", emoji:"🩳"},
  {id:15, supplierId:1, name:"Shorts", category:"Shorts", brand:"CALVIN KLEIN", model:"Shorts Casual Essential", price:199.90, stock:10, size:"M", color:"Bege", description:"Shorts casual fictício.", emoji:"🩳"},

  {id:16, supplierId:2, name:"Camisa", category:"Camisa", brand:"NIKE", model:"Camisa Sports Basic", price:179.90, stock:30, size:"M", color:"Branca", description:"Camisa esportiva fictícia.", emoji:"👕"},
  {id:17, supplierId:2, name:"Camisa", category:"Camisa", brand:"PUMA", model:"Camisa Active Training", price:159.90, stock:25, size:"G", color:"Preta", description:"Camisa esportiva fictícia.", emoji:"👕"},
  {id:18, supplierId:2, name:"Camisa", category:"Camisa", brand:"ADIDAS", model:"Camisa Performance", price:169.90, stock:27, size:"M", color:"Azul", description:"Camisa esportiva fictícia.", emoji:"👕"},
  {id:19, supplierId:2, name:"Camisa", category:"Camisa", brand:"NEW BALANCE", model:"Camisa Running Comfort", price:189.90, stock:14, size:"G", color:"Cinza", description:"Camisa esportiva fictícia.", emoji:"👕"},
  {id:20, supplierId:2, name:"Camisa", category:"Camisa", brand:"CALVIN KLEIN", model:"Camisa Cotton Classic", price:229.90, stock:12, size:"M", color:"Branca", description:"Camisa casual fictícia.", emoji:"👕"},

  {id:21, supplierId:1, name:"Blusa", category:"Blusa", brand:"NIKE", model:"Blusa Sports Fleece", price:299.90, stock:17, size:"M", color:"Preta", description:"Blusa de frio esportiva fictícia.", emoji:"🧥"},
  {id:22, supplierId:1, name:"Blusa", category:"Blusa", brand:"PUMA", model:"Blusa Essential Hoodie", price:279.90, stock:13, size:"G", color:"Cinza", description:"Blusa esportiva fictícia.", emoji:"🧥"},
  {id:23, supplierId:1, name:"Blusa", category:"Blusa", brand:"ADIDAS", model:"Blusa Training Fleece", price:289.90, stock:16, size:"M", color:"Marinho", description:"Blusa esportiva fictícia.", emoji:"🧥"},
  {id:24, supplierId:1, name:"Blusa", category:"Blusa", brand:"NEW BALANCE", model:"Blusa Comfort Warm", price:319.90, stock:9, size:"G", color:"Verde", description:"Blusa casual fictícia.", emoji:"🧥"},
  {id:25, supplierId:1, name:"Blusa", category:"Blusa", brand:"CALVIN KLEIN", model:"Blusa Urban Premium", price:399.90, stock:6, size:"M", color:"Preta", description:"Blusa casual fictícia.", emoji:"🧥"},

  {id:26, supplierId:2, name:"Meia", category:"Meia", brand:"NIKE", model:"Meia Sports Crew", price:49.90, stock:45, size:"39-42", color:"Branca", description:"Meia esportiva fictícia.", emoji:"🧦"},
  {id:27, supplierId:2, name:"Meia", category:"Meia", brand:"PUMA", model:"Meia Active Comfort", price:39.90, stock:38, size:"39-42", color:"Preta", description:"Meia esportiva fictícia.", emoji:"🧦"},
  {id:28, supplierId:2, name:"Meia", category:"Meia", brand:"ADIDAS", model:"Meia Performance Basic", price:44.90, stock:42, size:"39-42", color:"Branca", description:"Meia esportiva fictícia.", emoji:"🧦"},
  {id:29, supplierId:2, name:"Meia", category:"Meia", brand:"NEW BALANCE", model:"Meia Running Comfort", price:54.90, stock:29, size:"40-43", color:"Cinza", description:"Meia esportiva fictícia.", emoji:"🧦"},
  {id:30, supplierId:2, name:"Meia", category:"Meia", brand:"CALVIN KLEIN", model:"Meia Cotton Essential", price:69.90, stock:21, size:"39-42", color:"Preta", description:"Meia casual fictícia.", emoji:"🧦"},

  {id:31, supplierId:1, name:"Boné", category:"Boné", brand:"NIKE", model:"Boné Sports Classic", price:119.90, stock:18, size:"Único", color:"Preto", description:"Boné esportivo fictício.", emoji:"🧢"},
  {id:32, supplierId:1, name:"Boné", category:"Boné", brand:"PUMA", model:"Boné Active Cap", price:99.90, stock:15, size:"Único", color:"Azul", description:"Boné esportivo fictício.", emoji:"🧢"},
  {id:33, supplierId:1, name:"Boné", category:"Boné", brand:"ADIDAS", model:"Boné Performance Cap", price:109.90, stock:20, size:"Único", color:"Branco", description:"Boné esportivo fictício.", emoji:"🧢"},
  {id:34, supplierId:1, name:"Boné", category:"Boné", brand:"NEW BALANCE", model:"Boné Running Classic", price:129.90, stock:11, size:"Único", color:"Cinza", description:"Boné esportivo fictício.", emoji:"🧢"},
  {id:35, supplierId:1, name:"Boné", category:"Boné", brand:"CALVIN KLEIN", model:"Boné Urban Essential", price:159.90, stock:8, size:"Único", color:"Preto", description:"Boné casual fictício.", emoji:"🧢"}
];

let products = JSON.parse(localStorage.getItem("vitrineProducts")) || DEFAULT_PRODUCTS;
let currentRole = "cliente";
let currentFilter = "Todos";

function saveClients(){
  const demoIds = new Set([1,2]);
  const customClients = CLIENTS_DB.filter(c => !demoIds.has(Number(c.id)));
  localStorage.setItem("vitrineClientsDB", JSON.stringify(customClients));
}
function openClientRegistration(){
  const form=document.getElementById("clientRegistrationForm");
  if(form) form.reset();
  document.getElementById("clientRegistrationModal").classList.add("open");
}
function closeClientRegistration(){document.getElementById("clientRegistrationModal").classList.remove("open");}
function registerClient(event){
  event.preventDefault();
  const get=id=>document.getElementById(id);
  const values={
    nome:get("clientNome").value.trim(),
    email:get("clientEmail").value.trim().toLowerCase(),
    telefone:get("clientTelefone").value.trim(),
    cidade:get("clientCidade").value.trim(),
    estado:get("clientEstado").value.trim().toUpperCase(),
    senha:get("clientSenha").value
  };
  if(!values.nome||!values.email||!values.telefone||!values.cidade||!values.estado||!values.senha){showToast("Preencha todos os campos obrigatórios.");return;}
  if(values.estado.length!==2){showToast("Informe a UF com 2 letras, por exemplo: SP.");get("clientEstado").focus();return;}
  if(values.senha.length<6){showToast("A senha precisa ter pelo menos 6 caracteres.");get("clientSenha").focus();return;}
  if(values.senha!==get("clientSenha2").value){showToast("As senhas não são iguais.");get("clientSenha2").focus();return;}
  if(CLIENTS_DB.some(c=>String(c.email||"").toLowerCase()===values.email)||SUPPLIERS_DB.some(s=>String(s.email||"").toLowerCase()===values.email)||ADMINS_DB.some(a=>String(a.email||"").toLowerCase()===values.email)){showToast("Este e-mail já está cadastrado.");get("clientEmail").focus();return;}
  const id=CLIENTS_DB.length?Math.max(...CLIENTS_DB.map(c=>Number(c.id)||0))+1:1;
  const client={id,nome:values.nome,email:values.email,senha:values.senha,telefone:values.telefone,cidade:values.cidade,estado:values.estado};
  CLIENTS_DB.push(client);
  saveClients();
  selectRole("cliente");
  closeClientRegistration();
  get("loginEmail").value=values.email;
  get("loginPassword").value=values.senha;
  showToast("Cadastro de cliente realizado com sucesso! Agora clique em Entrar.");
}

function saveSuppliers(){localStorage.setItem("vitrineSuppliersDB",JSON.stringify(SUPPLIERS_DB));}
function openSupplierRegistration(){document.getElementById("supplierRegistrationForm").reset();document.getElementById("supplierRegistrationModal").classList.add("open");}
function closeSupplierRegistration(){document.getElementById("supplierRegistrationModal").classList.remove("open");}
function registerSupplier(event){
  event.preventDefault();
  try {
    const get = id => document.getElementById(id);
    const values = {
      responsavel: get("regResponsavel").value.trim(),
      empresa: get("regEmpresa").value.trim(),
      cnpj: get("regCnpj").value.trim(),
      email: get("regEmail").value.trim().toLowerCase(),
      telefone: get("regTelefone").value.trim(),
      endereco: get("regEndereco").value.trim(),
      cidade: get("regCidade").value.trim(),
      estado: get("regEstado").value.trim().toUpperCase(),
      descricao: get("regDescricao").value.trim(),
      senha: get("regSenha").value
    };

    if (!values.responsavel || !values.empresa || !values.cnpj || !values.email ||
        !values.telefone || !values.endereco || !values.cidade || !values.estado || !values.senha) {
      showToast("Preencha todos os campos obrigatórios.");
      return;
    }
    if (values.estado.length !== 2) {
      showToast("Informe a UF com 2 letras, por exemplo: SP.");
      get("regEstado").focus();
      return;
    }
    if (values.senha.length < 6) {
      showToast("A senha precisa ter pelo menos 6 caracteres.");
      get("regSenha").focus();
      return;
    }
    if (values.senha !== get("regSenha2").value) {
      showToast("As senhas não são iguais.");
      get("regSenha2").focus();
      return;
    }
    if (!Array.isArray(SUPPLIERS_DB)) SUPPLIERS_DB = [];
    if (SUPPLIERS_DB.some(s => String(s.email || "").trim().toLowerCase() === values.email)) {
      showToast("Este e-mail já está cadastrado.");
      get("regEmail").focus();
      return;
    }

    const id = SUPPLIERS_DB.length
      ? Math.max(...SUPPLIERS_DB.map(s => Number(s.id) || 0)) + 1
      : 1;
    const supplier = {
      id,
      empresa: values.empresa,
      responsavel: values.responsavel,
      cnpj: values.cnpj,
      email: values.email,
      senha: values.senha,
      telefone: values.telefone,
      endereco: values.endereco,
      cidade: values.cidade,
      estado: values.estado,
      descricao: values.descricao || "Fornecedor cadastrado na Vitrine Pro."
    };

    SUPPLIERS_DB.push(supplier);
    localStorage.setItem("vitrineSuppliersDB", JSON.stringify(SUPPLIERS_DB));

    // Cria um item inicial para que a nova loja já apareça no catálogo do cliente.
    const nextProductId = products.length
      ? Math.max(...products.map(p => Number(p.id) || 0)) + 1
      : 1;
    products.push({
      id: nextProductId,
      supplierId: id,
      name: "Produto novo",
      category: "Outros",
      brand: "Marca própria",
      model: "Cadastre seu primeiro produto",
      price: 0,
      stock: 0,
      size: "-",
      color: "-",
      description: "Produto inicial criado automaticamente. Edite ou exclua este item no catálogo do fornecedor.",
      emoji: "📦"
    });
    saveProducts();

    // Volta para o login de fornecedor e preenche os dados recém-criados.
    selectRole("fornecedor");
    closeSupplierRegistration();
    get("loginEmail").value = values.email;
    get("loginPassword").value = values.senha;
    showToast("Cadastro realizado com sucesso! Agora clique em Entrar.");
  } catch (error) {
    console.error("Erro no cadastro de fornecedor:", error);
    showToast("Não foi possível concluir o cadastro. Verifique se o navegador permite armazenamento local.");
  }
}
function renderSupplierInfo(s){if(!s)return;const ps=products.filter(p=>Number(p.supplierId)===Number(s.id));const stock=ps.reduce((a,p)=>a+Number(p.stock||0),0);const value=ps.reduce((a,p)=>a+Number(p.stock||0)*Number(p.price||0),0);document.getElementById("supplierStatProducts").textContent=ps.length;document.getElementById("supplierStatStock").textContent=stock;document.getElementById("supplierStatValue").textContent=formatBRL(value);document.getElementById("supplierStatLocation").textContent=`${s.cidade}-${s.estado}`;document.getElementById("supplierInfoCard").innerHTML=`<h3 style="margin:0">${escapeHtml(s.empresa)}</h3><p style="color:#777">${escapeHtml(s.descricao||"")}</p><div class="supplier-info-grid"><div class="supplier-info-item"><small>Responsável</small><strong>${escapeHtml(s.responsavel)}</strong></div><div class="supplier-info-item"><small>CNPJ</small><strong>${escapeHtml(s.cnpj||"Não informado")}</strong></div><div class="supplier-info-item"><small>Local</small><strong>${escapeHtml(s.endereco||`${s.cidade}-${s.estado}`)}</strong></div><div class="supplier-info-item"><small>Contato</small><strong>${escapeHtml(s.email)} · ${escapeHtml(s.telefone||"")}</strong></div></div>`;}

function saveProducts(){
  localStorage.setItem("vitrineProducts", JSON.stringify(products));
}

function selectRole(role){
  currentRole = role;
  document.querySelectorAll(".role-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.role === role);
  });
}

function fillDemo(){
  const user = currentRole === "cliente" ? CLIENTS_DB[0] : SUPPLIERS_DB[0];
  document.getElementById("loginEmail").value = user.email;
  document.getElementById("loginPassword").value = user.senha;
}

function login(event){
  event.preventDefault();

  const email = document.getElementById("loginEmail").value.trim().toLowerCase();
  const password = document.getElementById("loginPassword").value;

  const database = currentRole === "cliente" ? CLIENTS_DB : SUPPLIERS_DB;
  const clientOverrides = currentRole === "cliente" ? getClientOverrides() : {};
  const user = database.find(item => {
    const override = clientOverrides[item.id] || {};
    const savedPassword = currentRole === "cliente" && override.senha ? override.senha : item.senha;
    return item.email.toLowerCase() === email && savedPassword === password;
  });

  if(!user){
    showToast("E-mail ou senha inválidos.");
    return;
  }

  const accountName = currentRole === "cliente"
    ? user.nome
    : user.responsavel;

  sessionStorage.setItem("vitrineLoggedUser", JSON.stringify({
    role: currentRole,
    id: user.id,
    nome: accountName,
    email: user.email
  }));

  document.getElementById("loginPage").style.display = "none";

  if(currentRole === "cliente"){
    document.getElementById("clientApp").classList.add("active");
    document.getElementById("clientName").textContent = accountName;
    buildFilters();
    renderProducts();
  }else{
    document.getElementById("supplierApp").classList.add("active");
    document.getElementById("supplierName").textContent = accountName;
    renderSupplier();
  }

  showToast("Login realizado com sucesso.");
}

let cart = JSON.parse(localStorage.getItem("vitrineCart")) || [];

function saveCart(){
  localStorage.setItem("vitrineCart", JSON.stringify(cart));
}

function addToCart(productId){
  const product = products.find(p => p.id === productId);
  if(!product || product.stock <= 0) return;

  const existing = cart.find(item => item.productId === productId);

  if(existing){
    if(existing.quantity < product.stock){
      existing.quantity++;
    }else{
      showToast("Quantidade máxima disponível atingida.");
      return;
    }
  }else{
    cart.push({productId, quantity:1});
  }

  saveCart();
  updateCartUI();
  showToast("Produto adicionado ao pedido simulado.");
}

function changeCartQuantity(productId, delta){
  const product = products.find(p => p.id === productId);
  const item = cart.find(i => i.productId === productId);
  if(!product || !item) return;

  item.quantity += delta;

  if(item.quantity <= 0){
    cart = cart.filter(i => i.productId !== productId);
  }else if(item.quantity > product.stock){
    item.quantity = product.stock;
    showToast("Limite de estoque atingido.");
  }

  saveCart();
  updateCartUI();
}

function removeFromCart(productId){
  cart = cart.filter(i => i.productId !== productId);
  saveCart();
  updateCartUI();
}

function updateCartUI(){
  const badge = document.getElementById("cartBadge");
  const itemsContainer = document.getElementById("cartItems");
  const totalElement = document.getElementById("cartTotal");
  const button = document.getElementById("simulateButton");

  const totalItems = cart.reduce((sum,item) => sum + item.quantity, 0);
  const totalValue = cart.reduce((sum,item) => {
    const p = products.find(product => product.id === item.productId);
    return sum + (p ? p.price * item.quantity : 0);
  }, 0);

  if(badge) badge.textContent = totalItems;
  if(totalElement) totalElement.textContent = formatBRL(totalValue);
  if(button) button.disabled = cart.length === 0;

  if(!itemsContainer) return;

  if(!cart.length){
    itemsContainer.innerHTML = `
      <div class="cart-empty">
        🛒<br><br>
        Seu pedido simulado está vazio.<br>
        Adicione produtos das lojas para montar sua lista.
      </div>`;
    return;
  }

  itemsContainer.innerHTML = cart.map(item => {
    const p = products.find(product => product.id === item.productId);
    if(!p) return "";

    const supplier = SUPPLIERS_DB.find(s => s.id === p.supplierId);

    return `
      <div class="cart-item">
        <div class="cart-item-image">${p.emoji || "📦"}</div>
        <div>
          <h4>${escapeHtml(p.model || p.name)}</h4>
          <small>${escapeHtml(p.brand || "")} · ${escapeHtml(p.name)}</small>
          <small>Loja: ${escapeHtml(supplier?.responsavel || "Fornecedor")}</small>
          <div class="qty-controls">
            <button onclick="changeCartQuantity(${p.id},-1)">−</button>
            <strong>${item.quantity}</strong>
            <button onclick="changeCartQuantity(${p.id},1)">+</button>
            <button class="cart-remove" onclick="removeFromCart(${p.id})">Remover</button>
          </div>
        </div>
        <div class="cart-item-price">${formatBRL(p.price * item.quantity)}</div>
      </div>
    `;
  }).join("");
}

function openCart(){
  updateCartUI();
  document.getElementById("cartDrawer").classList.add("open");
  document.getElementById("cartBackdrop").classList.add("open");
}

function closeCart(){
  document.getElementById("cartDrawer").classList.remove("open");
  document.getElementById("cartBackdrop").classList.remove("open");
}

function simulatePurchase(){
  if(!cart.length) return;

  const totalItems = cart.reduce((sum,item) => sum + item.quantity, 0);
  const totalValue = cart.reduce((sum,item) => {
    const p = products.find(product => product.id === item.productId);
    return sum + (p ? p.price * item.quantity : 0);
  }, 0);

  const code = "SIM-" + Math.random().toString(36).substring(2,8).toUpperCase();
  const result = document.getElementById("simulationResult");

  result.innerHTML = `
    <strong>Pedido simulado criado!</strong><br>
    Código: ${code}<br>
    ${totalItems} item${totalItems === 1 ? "" : "s"} · Total estimado: ${formatBRL(totalValue)}<br>
    <span style="color:#555">Nenhum pagamento foi realizado. Em uma versão futura,
    este pedido poderá gerar uma mensagem para contato com o fornecedor.</span>
  `;
  result.classList.add("show");
  showToast("Simulação concluída.");
}

function logout(){
  closeCart();
  document.querySelectorAll(".app").forEach(app => app.classList.remove("active"));
  document.getElementById("loginPage").style.display = "grid";
  document.getElementById("loginForm").reset();
}

function showClientSection(){
  window.scrollTo({top:0,behavior:"smooth"});
}
function showSupplierSection(){
  window.scrollTo({top:0,behavior:"smooth"});
  renderSupplier();
}

function buildFilters(){
  const categories = ["Todos", ...new Set(products.map(p => p.category))];
  const container = document.getElementById("filterOptions");
  if(!container) return;
  container.innerHTML = categories.map(cat =>
    `<button class="filter-chip ${cat === currentFilter ? "active":""}" onclick="setFilter('${escapeHtml(cat)}')">${escapeHtml(cat)}</button>`
  ).join("");
}

function setFilter(category){
  currentFilter = category;
  buildFilters();
  renderProducts();
}

function toggleFilters(){
  document.getElementById("filterPanel").classList.toggle("open");
}

function renderProducts(){
  const search = document.getElementById("productSearch").value.toLowerCase().trim();
  const container = document.getElementById("productGrid");

  const filtered = products.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(search) ||
      p.category.toLowerCase().includes(search) ||
      (p.brand || "").toLowerCase().includes(search) ||
      (p.model || "").toLowerCase().includes(search) ||
      (p.description || "").toLowerCase().includes(search);

    const matchesFilter = currentFilter === "Todos" || p.category === currentFilter;
    return matchesSearch && matchesFilter;
  });

  document.getElementById("productCount").textContent =
    `${filtered.length} produto${filtered.length === 1 ? "" : "s"}`;

  if(!filtered.length){
    container.innerHTML = `<div class="empty">Nenhum produto encontrado para os filtros selecionados.</div>`;
    return;
  }

  // Cada fornecedor recebe sua própria "loja".
  const suppliers = [...SUPPLIERS_DB].sort((a,b) => a.id - b.id).map(supplier => ({
    ...supplier,
    products: filtered.filter(p => Number(p.supplierId) === Number(supplier.id))
  })).filter(supplier => supplier.products.length > 0);

  container.innerHTML = suppliers.map(supplier => `
    <section class="store-section">
      <div class="store-header">
        <div class="store-title">
          <div class="store-avatar">${escapeHtml(
            supplier.empresa.substring(0,2).toUpperCase()
          )}</div>
          <div>
            <h3>${escapeHtml(supplier.empresa)}</h3>
            <p>Fornecedor: ${escapeHtml(supplier.responsavel)} · Loja independente</p>
          </div>
        </div>
        <div class="store-count">
          ${supplier.products.length} produto${supplier.products.length === 1 ? "" : "s"}
        </div>
      </div>

      <div class="product-grid">
        ${supplier.products.map(p => `
          <article class="product-card">
            <div class="product-image">${p.emoji || "📦"}</div>
            <div class="product-info">
              <div class="product-category">${escapeHtml(p.category)} · ${escapeHtml(p.brand || "")}</div>
              <h3>${escapeHtml(p.model || p.name)}</h3>
              <p>${escapeHtml(p.description || "Produto disponível no catálogo.")}</p>
              <div class="price">${formatBRL(p.price)}</div>
              <div class="stock">
                ${p.stock > 0
                  ? "Disponível: " + p.stock + " unidades"
                  : "Produto esgotado"}
              </div>
              <div class="product-actions">
                <button class="cart-add-btn" ${p.stock <= 0 ? "disabled" : ""}
                  onclick="addToCart(${p.id})">
                  ${p.stock > 0 ? "Adicionar à simulação" : "Esgotado"}
                </button>
                <button class="cart-icon-btn" title="Adicionar ao pedido simulado"
                  ${p.stock <= 0 ? "disabled" : ""} onclick="addToCart(${p.id})">🛒</button>
              </div>
            </div>
          </article>
        `).join("")}
      </div>
    </section>
  `).join("");
}

function renderSupplier(){
  const logged = JSON.parse(sessionStorage.getItem("vitrineLoggedUser") || "null");
  const supplierId = logged?.role === "fornecedor" ? logged.id : null;
  const supplierProducts = supplierId
    ? products.filter(p => Number(p.supplierId) === Number(supplierId))
    : products;
  const supplier = supplierId ? SUPPLIERS_DB.find(s => Number(s.id) === Number(supplierId)) : null;
  renderSupplierInfo(supplier);

  const tbody = document.getElementById("supplierTable");
  document.getElementById("supplierCount").textContent =
    `${supplierProducts.length} item${supplierProducts.length === 1 ? "" : "s"} no catálogo`;

  if(!supplierProducts.length){
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:40px;color:#777">Nenhum produto cadastrado.</td></tr>`;
    return;
  }

  tbody.innerHTML = supplierProducts.map(p => `
    <tr>
      <td>
        <strong>${escapeHtml(p.name)}</strong><br>
        <small style="color:#777">${escapeHtml(p.model)}</small>
      </td>
      <td>${escapeHtml(p.brand)}</td>
      <td>${escapeHtml(p.category)}</td>
      <td><strong>${formatBRL(p.price)}</strong></td>
      <td>${p.stock}</td>
      <td><span class="status">${p.stock > 0 ? "Disponível" : "Esgotado"}</span></td>
      <td>
        <button class="table-action" onclick="editProduct(${p.id})">Editar</button>
        <button class="table-action delete" onclick="deleteProduct(${p.id})">Excluir</button>
      </td>
    </tr>
  `).join("");
}

function openProductModal(id=null){
  document.getElementById("productForm").reset();
  document.getElementById("editProductId").value = "";
  document.getElementById("productModalTitle").textContent = "Adicionar produto";

  if(id !== null){
    const p = products.find(x => x.id === id);
    if(!p) return;
    document.getElementById("productModalTitle").textContent = "Editar produto";
    document.getElementById("editProductId").value = p.id;
    document.getElementById("productName").value = p.name;
    document.getElementById("productBrand").value = p.brand || "NIKE";
    document.getElementById("productModel").value = p.model || p.name;
    document.getElementById("productCategory").value = p.category;
    document.getElementById("productPrice").value = p.price;
    document.getElementById("productStock").value = p.stock;
    document.getElementById("productDescription").value = p.description || "";
  }
  document.getElementById("productModal").classList.add("open");
}

function closeProductModal(){
  document.getElementById("productModal").classList.remove("open");
}

function saveProduct(event){
  event.preventDefault();

  const id = Number(document.getElementById("editProductId").value);
  const item = {
    id: id || Date.now(),
    supplierId: JSON.parse(sessionStorage.getItem("vitrineLoggedUser") || "{}")?.id || 1,
    name: document.getElementById("productName").value,
    category: document.getElementById("productCategory").value,
    brand: document.getElementById("productBrand").value,
    model: document.getElementById("productModel").value.trim(),
    price: Number(document.getElementById("productPrice").value),
    stock: Number(document.getElementById("productStock").value),
    description: document.getElementById("productDescription").value.trim(),
    emoji: categoryEmoji(document.getElementById("productCategory").value)
  };

  if(id){
    const index = products.findIndex(p => p.id === id);
    if(index >= 0) products[index] = item;
  }else{
    products.push(item);
  }

  saveProducts();
  closeProductModal();
  renderSupplier();
  buildFilters();
  renderProducts();
  showToast(id ? "Produto atualizado." : "Produto adicionado ao catálogo.");
}

function editProduct(id){
  openProductModal(id);
}

function deleteProduct(id){
  const p = products.find(x => x.id === id);
  if(!p) return;
  if(!confirm(`Excluir "${p.name}" do catálogo?`)) return;
  products = products.filter(x => x.id !== id);
  saveProducts();
  renderSupplier();
  buildFilters();
  renderProducts();
  showToast("Produto excluído.");
}

function categoryEmoji(category){
  const map = {
    "Tênis":"👟",
    "Eletrônicos":"🎧",
    "Roupas":"👕",
    "Casa":"💡",
    "Ferramentas":"🧰",
    "Outros":"📦"
  };
  return map[category] || "📦";
}

function openSettings(){
  const role = currentRole;
  const name = localStorage.getItem("vitrineName_" + role) ||
    (role === "cliente" ? "Cliente Vitrine" : "Fornecedor Vitrine");

  document.getElementById("settingsName").value = name;
  document.getElementById("settingsLanguage").value =
    localStorage.getItem("vitrineLanguage") || "pt-BR";

  document.getElementById("settingsModal").classList.add("open");
}

function closeSettings(){
  document.getElementById("settingsModal").classList.remove("open");
}

function saveSettings(){
  const name = document.getElementById("settingsName").value.trim() || "Usuário Vitrine";
  const language = document.getElementById("settingsLanguage").value;

  localStorage.setItem("vitrineName_" + currentRole, name);
  localStorage.setItem("vitrineLanguage", language);

  if(currentRole === "cliente") document.getElementById("clientName").textContent = name;
  else document.getElementById("supplierName").textContent = name;

  closeSettings();
  showToast("Configurações salvas.");
}

function changeLanguage(){
  const language = localStorage.getItem("vitrineLanguage") || "pt-BR";
  const next = language === "pt-BR" ? "en-US" : language === "en-US" ? "es-ES" : "pt-BR";
  localStorage.setItem("vitrineLanguage", next);
  showToast("Idioma alterado para " + languageName(next) + ".");
}

function languageName(lang){
  return {"pt-BR":"Português","en-US":"English","es-ES":"Español"}[lang] || "Português";
}

function formatBRL(value){
  return Number(value).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
}

function escapeHtml(value){
  return String(value).replace(/[&<>"']/g, char => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[char]));
}

function showToast(message){
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

/* Fecha modais ao clicar fora */
document.querySelectorAll(".modal-backdrop").forEach(backdrop => {
  backdrop.addEventListener("click", e => {
    if(e.target === backdrop) backdrop.classList.remove("open");
  });
});

/* Inicialização */
updateCartUI();

/*
  IMPORTANTE:
  Este HTML não acessa o MySQL diretamente.
  A base SQL fornecida anteriormente é a fonte de dados para uma
  futura API/backend. Neste protótipo, CLIENTS_DB, SUPPLIERS_DB e
  DEFAULT_PRODUCTS reproduzem os mesmos registros para permitir
  testes completos sem servidor.
*/

/* ===== VITRINEPRO_04 - CADASTRO DE FORNECEDOR CORRIGIDO ===== */
function refreshClientCatalog(){
  try {
    if (typeof renderProducts === "function") renderProducts();
    if (typeof updateCartUI === "function") updateCartUI();
  } catch (error) { console.error("Erro ao atualizar catálogo:", error); }
}
function selectRole(role){
  currentRole = role === "fornecedor" ? "fornecedor" : "cliente";
  window.selectedRole = currentRole;
  document.querySelectorAll(".role-btn").forEach(btn => btn.classList.toggle("active", btn.dataset.role === currentRole));
}
function fillDemo(){
  const role = window.selectedRole || "cliente";
  const demos = {
    cliente:{email:"joao.cliente@vitrinepro.com",password:"123456"},
    fornecedor:{email:"carlos.fornecedor@vitrinepro.com",password:"123456"}
  };
  const d=demos[role]||demos.cliente;
  const e=document.getElementById("loginEmail"), p=document.getElementById("loginPassword");
  if(e)e.value=d.email; if(p)p.value=d.password;
}
document.addEventListener("DOMContentLoaded",()=>{ window.selectedRole="cliente"; setTimeout(refreshClientCatalog,50); });



/* ===== VITRINEPRO_06 - ADMINISTRADOR ===== */
const ADMINS_DB = [{id:1,nome:"Administrador Vitrine Pro",email:"admin@vitrinepro.com",senha:"123456",role:"admin"}];
function getAdminLogs(){try{return JSON.parse(localStorage.getItem("vitrineAdminLogs")||"[]")}catch(e){return []}}
function saveAdminLogs(logs){localStorage.setItem("vitrineAdminLogs",JSON.stringify(logs.slice(-80)))}
function addAdminLog(text){const logs=getAdminLogs();logs.push({date:new Date().toLocaleString("pt-BR"),text});saveAdminLogs(logs);}
function getAdminNotifications(){return [{icon:"🟢",text:`${SUPPLIERS_DB.length} fornecedor(es) cadastrado(s).`},{icon:"🔵",text:`${products.length} produto(s) disponível(is) na plataforma.`},{icon:"📋",text:`${cart.length} item(ns) na simulação de interesse local.`}]}
function showAdminPanel(tab,button){document.querySelectorAll(".admin-panel").forEach(p=>p.classList.remove("active"));const panel=document.getElementById("adminPanel"+tab.charAt(0).toUpperCase()+tab.slice(1));if(panel)panel.classList.add("active");document.querySelectorAll("[data-admin-tab]").forEach(b=>b.classList.remove("active"));if(button)button.classList.add("active");renderAdmin();}
function renderAdmin(){
  const stock=products.reduce((a,p)=>a+Number(p.stock||0),0);
  document.getElementById("adminStatClients").textContent=CLIENTS_DB.length;document.getElementById("adminStatSuppliers").textContent=SUPPLIERS_DB.length;document.getElementById("adminStatProducts").textContent=products.length;document.getElementById("adminStatStock").textContent=stock;
  const categories={};products.forEach(p=>categories[p.category]=(categories[p.category]||0)+1);const top=Object.entries(categories).sort((a,b)=>b[1]-a[1]).slice(0,5);document.getElementById("adminOverview").innerHTML=top.map(([k,v])=>`<div class="admin-log"><span>${escapeHtml(k)}</span><strong style="margin-left:auto">${v}</strong></div>`).join("")||'<div class="admin-empty">Nenhum produto cadastrado.</div>';
  document.getElementById("adminPending").innerHTML=`<div class="admin-log"><span>Fornecedores ativos</span><strong style="margin-left:auto">${SUPPLIERS_DB.length}</strong></div><div class="admin-log"><span>Produtos sem estoque</span><strong style="margin-left:auto">${products.filter(p=>Number(p.stock)<=0).length}</strong></div><div class="admin-log"><span>Itens de interesse</span><strong style="margin-left:auto">${cart.reduce((a,i)=>a+i.quantity,0)}</strong></div>`;
  const logs=getAdminLogs().slice(-6).reverse();document.getElementById("adminRecentLogs").innerHTML=logs.length?logs.map(l=>`<div class="admin-log"><small>${escapeHtml(l.date)}</small><span>${escapeHtml(l.text)}</span></div>`).join(""):'<div class="admin-empty">Nenhuma atividade registrada ainda.</div>';
  document.getElementById("adminUsersTable").innerHTML=`<table><thead><tr><th>Nome</th><th>E-mail</th><th>Local</th><th>Status</th><th>Ações</th></tr></thead><tbody>${CLIENTS_DB.map(c=>`<tr><td><strong>${escapeHtml(c.nome)}</strong></td><td>${escapeHtml(c.email)}</td><td>${escapeHtml(c.cidade)} - ${escapeHtml(c.estado)}</td><td><span class="admin-status">Ativo</span></td><td><div class="admin-actions"><button onclick="adminViewUser(${c.id})">Ver</button><button class="danger" onclick="adminToggleUser(${c.id})">Bloquear</button></div></td></tr>`).join("")}</tbody></table>`;
  document.getElementById("adminSuppliersTable").innerHTML=`<table><thead><tr><th>Empresa</th><th>Responsável</th><th>Local</th><th>Produtos</th><th>Status</th><th>Ações</th></tr></thead><tbody>${SUPPLIERS_DB.map(s=>{const n=products.filter(p=>Number(p.supplierId)===Number(s.id)).length;return `<tr><td><strong>${escapeHtml(s.empresa)}</strong></td><td>${escapeHtml(s.responsavel)}</td><td>${escapeHtml(s.cidade)} - ${escapeHtml(s.estado)}</td><td>${n}</td><td><span class="admin-status">Ativo</span></td><td><div class="admin-actions"><button onclick="adminViewSupplier(${s.id})">Ver</button><button class="danger" onclick="adminToggleSupplier(${s.id})">Bloquear</button></div></td></tr>`}).join("")}</tbody></table>`;
  document.getElementById("adminProductsTable").innerHTML=`<table><thead><tr><th>Produto</th><th>Fornecedor</th><th>Preço</th><th>Estoque</th><th>Status</th><th>Ações</th></tr></thead><tbody>${products.map(p=>{const s=SUPPLIERS_DB.find(x=>Number(x.id)===Number(p.supplierId));return `<tr><td><strong>${escapeHtml(p.model||p.name)}</strong></td><td>${escapeHtml(s?.empresa||"Não identificado")}</td><td>${formatBRL(p.price)}</td><td>${p.stock}</td><td><span class="admin-status ${p.stock<=0?'blocked':''}">${p.stock>0?'Ativo':'Esgotado'}</span></td><td><div class="admin-actions"><button onclick="adminViewProduct(${p.id})">Ver</button><button class="danger" onclick="adminRemoveProduct(${p.id})">Remover</button></div></td></tr>`}).join("")}</tbody></table>`;
  const interestRows=cart.map(i=>{const p=products.find(x=>Number(x.id)===Number(i.productId));const s=p&&SUPPLIERS_DB.find(x=>Number(x.id)===Number(p.supplierId));return p?`<tr><td>Cliente atual</td><td>${escapeHtml(p.model||p.name)}</td><td>${escapeHtml(s?.empresa||"-")}</td><td>${i.quantity}</td><td>${formatBRL(p.price*i.quantity)}</td></tr>`:""}).join("");document.getElementById("adminInterestsTable").innerHTML=interestRows?`<table><thead><tr><th>Cliente</th><th>Produto</th><th>Fornecedor</th><th>Qtd.</th><th>Valor estimado</th></tr></thead><tbody>${interestRows}</tbody></table>`:'<div class="admin-empty">Nenhum interesse na simulação atual.</div>';
  document.getElementById("adminNotifications").innerHTML=getAdminNotifications().map(n=>`<div class="admin-log"><span style="font-size:20px">${n.icon}</span><span>${escapeHtml(n.text)}</span></div>`).join("");
  document.getElementById("adminLogs").innerHTML=logs.length?logs.map(l=>`<div class="admin-log"><small>${escapeHtml(l.date)}</small><span>${escapeHtml(l.text)}</span></div>`).join(""):'<div class="admin-empty">Nenhuma atividade registrada.</div>';
}
function adminViewUser(id){const c=CLIENTS_DB.find(x=>x.id===id);if(c)alert(`Cliente\n\nNome: ${c.nome}\nE-mail: ${c.email}\nTelefone: ${c.telefone||"Não informado"}\nLocal: ${c.cidade} - ${c.estado}`);}
function adminViewSupplier(id){const s=SUPPLIERS_DB.find(x=>Number(x.id)===Number(id));if(s)alert(`Fornecedor\n\nEmpresa: ${s.empresa}\nResponsável: ${s.responsavel}\nCNPJ: ${s.cnpj||"Não informado"}\nE-mail: ${s.email}\nTelefone: ${s.telefone||"Não informado"}\nLocal: ${s.endereco||((s.cidade||"")+" - "+(s.estado||""))}`);}
function adminViewProduct(id){const p=products.find(x=>Number(x.id)===Number(id));if(p)alert(`Produto\n\n${p.model||p.name}\nMarca: ${p.brand||"-"}\nPreço: ${formatBRL(p.price)}\nEstoque: ${p.stock}`);}
function adminRemoveProduct(id){const p=products.find(x=>Number(x.id)===Number(id));if(!p)return;if(!confirm(`Remover \"${p.model||p.name}\" do catálogo?`))return;products=products.filter(x=>Number(x.id)!==Number(id));saveProducts();addAdminLog(`ADM removeu o produto ${p.model||p.name}.`);renderAdmin();buildFilters();renderProducts();showToast("Produto removido pelo ADM.");}
function adminToggleSupplier(id){const s=SUPPLIERS_DB.find(x=>Number(x.id)===Number(id));if(!s)return;s.status=s.status==="bloqueado"?"ativo":"bloqueado";saveSuppliers();addAdminLog(`ADM alterou o status do fornecedor ${s.empresa} para ${s.status}.`);renderAdmin();showToast("Status do fornecedor atualizado.");}
function adminToggleUser(id){addAdminLog(`ADM alterou o status do cliente #${id}.`);showToast("Status do cliente atualizado (simulação).");}
function selectRole(role){currentRole=role==="fornecedor"?"fornecedor":role==="admin"?"admin":"cliente";window.selectedRole=currentRole;document.querySelectorAll(".role-btn").forEach(btn=>btn.classList.toggle("active",btn.dataset.role===currentRole));}
function useDemoAccess(role){
  const demos={cliente:{email:"joao.cliente@vitrinepro.com",password:"123456"},fornecedor:{email:"carlos.fornecedor@vitrinepro.com",password:"123456"},admin:{email:"admin@vitrinepro.com",password:"123456"}};
  const d=demos[role]||demos.cliente;
  selectRole(role);
  document.getElementById("loginEmail").value=d.email;
  document.getElementById("loginPassword").value=d.password;
}
function fillDemo(){useDemoAccess(currentRole||"cliente");}
function login(event){event.preventDefault();const email=document.getElementById("loginEmail").value.trim().toLowerCase(),password=document.getElementById("loginPassword").value;let user=null;if(currentRole==="admin")user=ADMINS_DB.find(x=>x.email===email&&accountPasswordAdmin()===password);else{const database=currentRole==="cliente"?CLIENTS_DB:SUPPLIERS_DB;const overrides=currentRole==="cliente"?getClientOverrides():{};user=database.find(item=>{const ov=overrides[item.id]||{};return String(item.email).toLowerCase()===email&&(currentRole==="cliente"&&ov.senha?ov.senha:item.senha)===password;});}if(!user){showToast("E-mail ou senha inválidos.");return;}const accountName=currentRole==="cliente"?user.nome:currentRole==="fornecedor"?user.responsavel:user.nome;sessionStorage.setItem("vitrineLoggedUser",JSON.stringify({role:currentRole,id:user.id,nome:accountName,email:user.email}));localStorage.setItem("vitrineLastAccess_"+currentRole+"_"+user.id,new Date().toLocaleString("pt-BR"));addAdminLog(currentRole==="admin"?"ADM realizou login na plataforma.":`${accountName} realizou login como ${currentRole}.`);document.getElementById("loginPage").style.display="none";document.querySelectorAll(".app").forEach(a=>a.classList.remove("active"));if(currentRole==="cliente"){document.getElementById("clientApp").classList.add("active");document.getElementById("clientName").textContent=accountName;buildFilters();renderProducts();}else if(currentRole==="fornecedor"){document.getElementById("supplierApp").classList.add("active");document.getElementById("supplierName").textContent=accountName;renderSupplier();}else{document.getElementById("adminApp").classList.add("active");document.getElementById("adminName").textContent=accountName;showAdminPanel("dashboard");}showToast("Login realizado com sucesso.");}
function logout(){closeCart();closeSettings();document.querySelectorAll(".app").forEach(app=>app.classList.remove("active"));document.getElementById("loginPage").style.display="grid";document.getElementById("loginForm").reset();currentRole="cliente";window.selectedRole="cliente";document.querySelectorAll(".role-btn").forEach(btn=>btn.classList.toggle("active",btn.dataset.role==="cliente"));sessionStorage.removeItem("vitrineLoggedUser");}

function togglePassword(button){
  const wrap = button.closest(".password-wrap");
  const input = wrap ? wrap.querySelector('input[type="password"], input[type="text"]') : null;
  if(!input) return;

  const showing = input.type === "text";
  input.type = showing ? "password" : "text";
  button.textContent = showing ? "👁️" : "🙈";
  button.setAttribute("aria-label", showing ? "Mostrar senha" : "Ocultar senha");
  button.setAttribute("title", showing ? "Mostrar senha" : "Ocultar senha");
}


/* ===== VITRINEPRO_05 - CONFIGURAÇÕES COMPLETAS ===== */
function getLoggedAccount(){
  try{return JSON.parse(sessionStorage.getItem("vitrineLoggedUser")||"null");}catch(e){return null;}
}
function getClientOverrides(){
  try{return JSON.parse(localStorage.getItem("vitrineClientOverrides")||"{}");}catch(e){return {};}
}
function saveClientOverrides(data){localStorage.setItem("vitrineClientOverrides",JSON.stringify(data));}
function getPref(key, fallback){const v=localStorage.getItem("vitrinePref_"+key); return v===null?fallback:v;}
function setPref(key,value){localStorage.setItem("vitrinePref_"+key,String(value));}
function showSettingsTab(tab,button){
  document.querySelectorAll(".settings-panel").forEach(p=>p.classList.remove("active"));
  const target=document.getElementById("settings"+tab.charAt(0).toUpperCase()+tab.slice(1));
  if(target) target.classList.add("active");
  document.querySelectorAll(".settings-tab").forEach(b=>b.classList.remove("active"));
  if(button) button.classList.add("active");
}
function openSettings(){
  const account=getLoggedAccount();
  if(!account){showToast("Entre em uma conta para acessar as configurações.");return;}
  const role=account.role;
  const isSupplier=role==="fornecedor";
  document.querySelectorAll(".supplier-only").forEach(el=>el.style.display=isSupplier?"block":"none");
  document.querySelectorAll(".client-only").forEach(el=>el.style.display=isSupplier?"none":"flex");
  const source=isSupplier?SUPPLIERS_DB.find(x=>Number(x.id)===Number(account.id)):CLIENTS_DB.find(x=>Number(x.id)===Number(account.id));
  const overrides=getClientOverrides()[account.id]||{};
  const data=isSupplier?(source||{}):Object.assign({},source||{},overrides);
  document.getElementById("settingsName").value=data.responsavel||data.nome||account.nome||"";
  document.getElementById("settingsEmail").value=data.email||account.email||"";
  document.getElementById("settingsPhone").value=data.telefone||"";
  document.getElementById("settingsCity").value=data.cidade||"";
  document.getElementById("settingsState").value=data.estado||"";
  document.getElementById("settingsCnpj").value=data.cnpj||"";
  document.getElementById("settingsAddress").value=data.endereco||"";
  document.getElementById("settingsDescription").value=data.descricao||"";
  document.getElementById("settingsWhatsapp").value=data.whatsapp||data.telefone||"";
  document.getElementById("settingsLanguage").value=getPref("language",localStorage.getItem("vitrineLanguage")||"pt-BR");
  document.getElementById("settingsTheme").value=getPref("theme","light");
  document.getElementById("settingsFontSize").value=getPref("fontSize","normal");
  document.getElementById("settingsOnlyAvailable").checked=getPref("onlyAvailable","false")==="true";
  document.getElementById("settingsShowStock").checked=getPref("showStock","true")==="true";
  document.getElementById("settingsSort").value=getPref("sort","default");
  document.getElementById("notifySystem").checked=getPref("notifySystem","true")==="true";
  document.getElementById("notifyProducts").checked=getPref("notifyProducts","true")==="true";
  document.getElementById("notifyInterest").checked=getPref("notifyInterest","true")==="true";
  document.getElementById("notifyEmail").checked=getPref("notifyEmail","false")==="true";
  const last=localStorage.getItem("vitrineLastAccess_"+role+"_"+account.id);
  document.getElementById("settingsLastAccess").textContent=last||"Ainda não registrado";
  document.getElementById("settingsCurrentPassword").value="";document.getElementById("settingsNewPassword").value="";document.getElementById("settingsNewPassword2").value="";
  showSettingsTab("perfil",document.querySelector(".settings-tab"));
  renderInterestList();
  document.getElementById("settingsModal").classList.add("open");
}
function closeSettings(){document.getElementById("settingsModal").classList.remove("open");}
function saveSettingsV5(){
  const account=getLoggedAccount(); if(!account)return;
  const role=account.role, isSupplier=role==="fornecedor";
  const name=document.getElementById("settingsName").value.trim();
  if(!name){showToast("Informe um nome.");return;}
  if(isSupplier){
    const supplier=SUPPLIERS_DB.find(x=>Number(x.id)===Number(account.id));
    if(!supplier){showToast("Fornecedor não encontrado.");return;}
    supplier.responsavel=name;supplier.telefone=document.getElementById("settingsPhone").value.trim();supplier.cidade=document.getElementById("settingsCity").value.trim();supplier.estado=document.getElementById("settingsState").value.trim().toUpperCase();supplier.cnpj=document.getElementById("settingsCnpj").value.trim();supplier.endereco=document.getElementById("settingsAddress").value.trim();supplier.descricao=document.getElementById("settingsDescription").value.trim();supplier.whatsapp=document.getElementById("settingsWhatsapp").value.trim();saveSuppliers();
    const logged=Object.assign({},account,{nome:name});sessionStorage.setItem("vitrineLoggedUser",JSON.stringify(logged));
    document.getElementById("supplierName").textContent=name;
  }else{
    const all=getClientOverrides();all[account.id]={nome:name,telefone:document.getElementById("settingsPhone").value.trim(),cidade:document.getElementById("settingsCity").value.trim(),estado:document.getElementById("settingsState").value.trim().toUpperCase()};saveClientOverrides(all);
    const logged=Object.assign({},account,{nome:name});sessionStorage.setItem("vitrineLoggedUser",JSON.stringify(logged));document.getElementById("clientName").textContent=name;
  }
  setPref("language",document.getElementById("settingsLanguage").value);localStorage.setItem("vitrineLanguage",document.getElementById("settingsLanguage").value);
  setPref("theme",document.getElementById("settingsTheme").value);setPref("fontSize",document.getElementById("settingsFontSize").value);setPref("onlyAvailable",document.getElementById("settingsOnlyAvailable").checked);setPref("showStock",document.getElementById("settingsShowStock").checked);setPref("sort",document.getElementById("settingsSort").value);
  setPref("notifySystem",document.getElementById("notifySystem").checked);setPref("notifyProducts",document.getElementById("notifyProducts").checked);setPref("notifyInterest",document.getElementById("notifyInterest").checked);setPref("notifyEmail",document.getElementById("notifyEmail").checked);
  applyV5Appearance();if(role==="cliente")renderProducts();else renderSupplier();closeSettings();showToast("Configurações salvas com sucesso.");
}
function applyV5Appearance(){
  document.body.classList.toggle("dark-mode",getPref("theme","light")==="dark");document.body.classList.toggle("font-large",getPref("fontSize","normal")==="large");document.body.classList.toggle("font-small",getPref("fontSize","normal")==="small");
}
function changeUserPassword(){
  const account=getLoggedAccount();if(!account)return;
  const current=document.getElementById("settingsCurrentPassword").value,newPass=document.getElementById("settingsNewPassword").value,confirm=document.getElementById("settingsNewPassword2").value;
  let user=account.role==="fornecedor"?SUPPLIERS_DB.find(x=>Number(x.id)===Number(account.id)):CLIENTS_DB.find(x=>Number(x.id)===Number(account.id));
  if(!user){showToast("Conta não encontrada.");return;}
  const overrides=getClientOverrides(); if(account.role==="cliente" && overrides[account.id]?.senha) user=Object.assign({},user,overrides[account.id]);
  if(current!==user.senha){showToast("A senha atual está incorreta.");return;}if(newPass.length<6){showToast("A nova senha deve ter pelo menos 6 caracteres.");return;}if(newPass!==confirm){showToast("As novas senhas não são iguais.");return;}
  if(account.role==="fornecedor"){const real=SUPPLIERS_DB.find(x=>Number(x.id)===Number(account.id));real.senha=newPass;saveSuppliers();}
  else {const all=getClientOverrides();all[account.id]=Object.assign({},all[account.id]||{}, {senha:newPass});saveClientOverrides(all);}
  showToast("Senha alterada com sucesso.");document.getElementById("settingsCurrentPassword").value="";document.getElementById("settingsNewPassword").value="";document.getElementById("settingsNewPassword2").value="";
}
function renderInterestList(){
  const box=document.getElementById("interestList");if(!box)return;
  if(!cart.length){box.innerHTML='<div class="settings-note">Você ainda não possui produtos na sua simulação de interesse.</div>';return;}
  box.innerHTML=cart.map(item=>{const p=products.find(x=>Number(x.id)===Number(item.productId));if(!p)return "";const s=SUPPLIERS_DB.find(x=>Number(x.id)===Number(p.supplierId));return `<div class="interest-item"><div><strong>${escapeHtml(p.model||p.name)}</strong><small>${escapeHtml(s?.empresa||"Fornecedor")} · ${formatBRL(p.price)} · ${item.quantity} un.</small></div><div class="interest-actions"><button onclick="contactSupplier(${p.supplierId})">📞 Contatar</button><button onclick="removeFromCart(${p.id});renderInterestList()">Remover</button></div></div>`;}).join("");
}
function contactSupplier(supplierId){const s=SUPPLIERS_DB.find(x=>Number(x.id)===Number(supplierId));if(!s)return;const text=`Fornecedor: ${s.empresa}\nResponsável: ${s.responsavel}\nE-mail: ${s.email}\nTelefone: ${s.whatsapp||s.telefone||"Não informado"}\nLocal: ${s.endereco||((s.cidade||"")+" - "+(s.estado||""))}`;alert(text);}
function changeLanguage(){const current=getPref("language","pt-BR"),next=current==="pt-BR"?"en-US":current==="en-US"?"es-ES":"pt-BR";setPref("language",next);localStorage.setItem("vitrineLanguage",next);showToast("Idioma alterado para "+languageName(next)+". Salve em Configurações para manter as preferências.");}
/* ===== VITRINEPRO_07 - DIRETÓRIO DE FORNECEDORES ===== */
let selectedSupplierId = null;

function getSupplierProductList(supplierId){
  const only=getPref("onlyAvailable","false")==="true";
  let list=products.filter(p=>Number(p.supplierId)===Number(supplierId) && (!only || Number(p.stock)>0));
  const sort=getPref("sort","default");
  if(sort==="priceAsc") list.sort((a,b)=>a.price-b.price);
  else if(sort==="priceDesc") list.sort((a,b)=>b.price-a.price);
  else if(sort==="name") list.sort((a,b)=>(a.model||a.name).localeCompare(b.model||b.name));
  return list;
}

function supplierInitials(name){
  const words=String(name||"Fornecedor").trim().split(/\s+/).filter(Boolean);
  return (words.length>=2 ? words[0][0]+words[1][0] : String(name||"FO").slice(0,2)).toUpperCase();
}

function renderSupplierProducts(supplierId){
  const container=document.getElementById("productGrid");
  if(!container) return;
  const supplier=SUPPLIERS_DB.find(s=>Number(s.id)===Number(supplierId));
  if(!supplier){selectedSupplierId=null;renderProducts();return;}
  selectedSupplierId=Number(supplier.id);
  const supplierProducts=getSupplierProductList(supplier.id);
  const showStock=getPref("showStock","true")==="true";
  const count=document.getElementById("productCount");
  if(count) count.textContent=`${supplierProducts.length} produto${supplierProducts.length===1?"":"s"}`;

  let html=`<button class="supplier-back" onclick="selectedSupplierId=null;renderProducts()">← Voltar para fornecedores</button>`;
  html+=`<section class="store-section"><div class="store-header"><div class="store-title"><div class="store-avatar">${escapeHtml(supplierInitials(supplier.empresa))}</div><div><h3>${escapeHtml(supplier.empresa)}</h3><p>Responsável: ${escapeHtml(supplier.responsavel||"Não informado")}</p></div></div><div class="store-count">${supplierProducts.length} produto${supplierProducts.length===1?"":"s"}</div></div>`;
  html+=`<div class="supplier-products-head"><div><h3>Produtos cadastrados</h3><p>Produtos publicados por este fornecedor na Vitrine Pro.</p></div></div>`;
  if(!supplierProducts.length){
    html+=`<div class="empty">Este fornecedor ainda não possui produtos disponíveis no catálogo.</div></section>`;
    container.innerHTML=html;
    return;
  }
  html+=`<div class="product-grid">${supplierProducts.map(p=>`<article class="product-card"><div class="product-image">${p.emoji||"📦"}</div><div class="product-info"><div class="product-category">${escapeHtml(p.category)} · ${escapeHtml(p.brand||"")}</div><h3>${escapeHtml(p.model||p.name)}</h3><p>${escapeHtml(p.description||"Produto disponível no catálogo.")}</p><div class="price">${formatBRL(p.price)}</div><div class="stock">${p.stock>0?(showStock?"Disponível: "+p.stock+" unidades":"Disponível"):"Produto esgotado"}</div><div class="product-actions"><button class="cart-add-btn" ${p.stock<=0?"disabled":""} onclick="addToCart(${p.id})">${p.stock>0?"Adicionar à simulação":"Esgotado"}</button><button class="cart-icon-btn" title="Adicionar ao pedido simulado" ${p.stock<=0?"disabled":""} onclick="addToCart(${p.id})">🛒</button></div></div></article>`).join("")}</div></section>`;
  container.innerHTML=html;
}

function renderProducts(){
  const container=document.getElementById("productGrid");
  if(!container) return;
  if(selectedSupplierId!==null){renderSupplierProducts(selectedSupplierId);return;}

  const searchEl=document.getElementById("supplierSearch");
  const search=searchEl?searchEl.value.toLowerCase().trim():"";
  const suppliers=[...SUPPLIERS_DB].sort((a,b)=>String(a.empresa||"").localeCompare(String(b.empresa||""))).filter(s=>{
    const text=[s.empresa,s.responsavel,s.telefone,s.whatsapp,s.email,s.endereco,s.cidade,s.estado,s.descricao].join(" ").toLowerCase();
    return text.includes(search);
  });
  const count=document.getElementById("productCount");
  if(count) count.textContent=`${suppliers.length} fornecedor${suppliers.length===1?"":"es"}`;

  if(!suppliers.length){
    container.innerHTML='<div class="empty">Nenhum fornecedor encontrado para a busca.</div>';
    return;
  }

  container.innerHTML=`<div class="supplier-directory-grid">${suppliers.map(s=>{
    const ps=products.filter(p=>Number(p.supplierId)===Number(s.id));
    const phone=s.whatsapp||s.telefone||"Não informado";
    const location=s.endereco||`${s.cidade||""}${s.cidade&&s.estado?" - ":""}${s.estado||""}`||"Não informado";
    return `<article class="supplier-directory-card" onclick="renderSupplierProducts(${Number(s.id)})">
      <div class="supplier-directory-head">
        <div class="supplier-directory-avatar">${escapeHtml(supplierInitials(s.empresa))}</div>
        <div><h3>${escapeHtml(s.empresa||"Fornecedor")}</h3><p>Responsável: ${escapeHtml(s.responsavel||"Não informado")}</p></div>
      </div>
      <div class="supplier-contact-grid">
        <div class="supplier-contact-item"><small>Telefone</small><strong>${escapeHtml(phone)}</strong></div>
        <div class="supplier-contact-item"><small>E-mail</small><strong>${escapeHtml(s.email||"Não informado")}</strong></div>
        <div class="supplier-contact-item"><small>Localização</small><strong>${escapeHtml(location)}</strong></div>
        <div class="supplier-contact-item"><small>Produtos</small><strong>${ps.length} cadastrado${ps.length===1?"":"s"}</strong></div>
      </div>
      <p class="supplier-directory-description">${escapeHtml(s.descricao||"Fornecedor cadastrado na Vitrine Pro.")}</p>
      <button class="supplier-view-btn" type="button" onclick="event.stopPropagation();renderSupplierProducts(${Number(s.id)})">Ver produtos cadastrados</button>
    </article>`;
  }).join("")}</div>`;
}
/* Guarda o último acesso e preserva a troca de senha do cliente no login. */
const loginV5Original=login;
login=function(event){
  const result=loginV5Original(event);const account=getLoggedAccount();
  if(account){localStorage.setItem("vitrineLastAccess_"+account.role+"_"+account.id,new Date().toLocaleString("pt-BR"));applyV5Appearance();}
  return result;
};
applyV5Appearance();


/* ===== VITRINEPRO_06 - AJUSTES FINAIS DO ADMIN ===== */
function getAdminInterests(){try{return JSON.parse(localStorage.getItem("vitrineAdminInterests")||"[]")}catch(e){return []}}
function saveAdminInterests(items){localStorage.setItem("vitrineAdminInterests",JSON.stringify(items.slice(-200)))}
function simulatePurchase(){
  if(!cart.length) return;
  const account=getLoggedAccount()||{id:0,nome:"Cliente atual",role:"cliente"};
  const records=getAdminInterests();
  const code="SIM-"+Math.random().toString(36).substring(2,8).toUpperCase();
  cart.forEach(item=>{
    const product=products.find(p=>Number(p.id)===Number(item.productId));
    if(product) records.push({code,date:new Date().toLocaleString("pt-BR"),clientId:account.id,clientName:account.nome||"Cliente",productId:product.id,productName:product.model||product.name,supplierId:product.supplierId,quantity:item.quantity,value:Number(product.price||0)*item.quantity});
  });
  saveAdminInterests(records);
  document.getElementById("simulationResult").innerHTML=`<strong>Interesse registrado!</strong><br>Código: ${code}<br>${cart.reduce((a,i)=>a+i.quantity,0)} item(ns) · Total estimado: ${formatBRL(cart.reduce((a,i)=>{const p=products.find(x=>Number(x.id)===Number(i.productId));return a+(p?p.price*i.quantity:0)},0))}<br><span style="color:#555">Nenhum pagamento foi realizado. O interesse foi registrado para facilitar o contato com os fornecedores.</span>`;
  document.getElementById("simulationResult").classList.add("show");
  addAdminLog("Novo interesse registrado por "+(account.nome||"Cliente")+".");
  showToast("Interesse registrado com sucesso.");
}
function renderAdmin(){
  const stock=products.reduce((a,p)=>a+Number(p.stock||0),0);
  document.getElementById("adminStatClients").textContent=CLIENTS_DB.length;document.getElementById("adminStatSuppliers").textContent=SUPPLIERS_DB.length;document.getElementById("adminStatProducts").textContent=products.length;document.getElementById("adminStatStock").textContent=stock;
  const categories={};products.forEach(p=>categories[p.category]=(categories[p.category]||0)+1);const top=Object.entries(categories).sort((a,b)=>b[1]-a[1]).slice(0,5);document.getElementById("adminOverview").innerHTML=top.map(([k,v])=>`<div class="admin-log"><span>${escapeHtml(k)}</span><strong style="margin-left:auto">${v}</strong></div>`).join("")||'<div class="admin-empty">Nenhum produto cadastrado.</div>';
  const interests=getAdminInterests();document.getElementById("adminPending").innerHTML=`<div class="admin-log"><span>Fornecedores ativos</span><strong style="margin-left:auto">${SUPPLIERS_DB.filter(s=>s.status!=="bloqueado").length}</strong></div><div class="admin-log"><span>Produtos sem estoque</span><strong style="margin-left:auto">${products.filter(p=>Number(p.stock)<=0).length}</strong></div><div class="admin-log"><span>Interesses registrados</span><strong style="margin-left:auto">${interests.length}</strong></div>`;
  const logs=getAdminLogs().slice(-8).reverse();document.getElementById("adminRecentLogs").innerHTML=logs.length?logs.map(l=>`<div class="admin-log"><small>${escapeHtml(l.date)}</small><span>${escapeHtml(l.text)}</span></div>`).join(""):'<div class="admin-empty">Nenhuma atividade registrada ainda.</div>';
  document.getElementById("adminUsersTable").innerHTML=`<table><thead><tr><th>Nome</th><th>E-mail</th><th>Local</th><th>Status</th><th>Ações</th></tr></thead><tbody>${CLIENTS_DB.map(c=>`<tr><td><strong>${escapeHtml(c.nome)}</strong></td><td>${escapeHtml(c.email)}</td><td>${escapeHtml(c.cidade)} - ${escapeHtml(c.estado)}</td><td><span class="admin-status">Ativo</span></td><td><div class="admin-actions"><button onclick="adminViewUser(${c.id})">Ver</button><button class="danger" onclick="adminToggleUser(${c.id})">Bloquear</button></div></td></tr>`).join("")}</tbody></table>`;
  document.getElementById("adminSuppliersTable").innerHTML=`<table><thead><tr><th>Empresa</th><th>Responsável</th><th>Local</th><th>Produtos</th><th>Status</th><th>Ações</th></tr></thead><tbody>${SUPPLIERS_DB.map(s=>{const n=products.filter(p=>Number(p.supplierId)===Number(s.id)).length;const blocked=s.status==="bloqueado";return `<tr><td><strong>${escapeHtml(s.empresa)}</strong></td><td>${escapeHtml(s.responsavel)}</td><td>${escapeHtml(s.cidade)} - ${escapeHtml(s.estado)}</td><td>${n}</td><td><span class="admin-status ${blocked?'blocked':''}">${blocked?'Bloqueado':'Ativo'}</span></td><td><div class="admin-actions"><button onclick="adminViewSupplier(${s.id})">Ver</button><button class="danger" onclick="adminToggleSupplier(${s.id})">${blocked?'Ativar':'Bloquear'}</button></div></td></tr>`}).join("")}</tbody></table>`;
  document.getElementById("adminProductsTable").innerHTML=`<table><thead><tr><th>Produto</th><th>Fornecedor</th><th>Preço</th><th>Estoque</th><th>Status</th><th>Ações</th></tr></thead><tbody>${products.map(p=>{const su=SUPPLIERS_DB.find(x=>Number(x.id)===Number(p.supplierId));const blocked=su?.status==="bloqueado";return `<tr><td><strong>${escapeHtml(p.model||p.name)}</strong></td><td>${escapeHtml(su?.empresa||"Não identificado")}</td><td>${formatBRL(p.price)}</td><td>${p.stock}</td><td><span class="admin-status ${blocked||p.stock<=0?'blocked':''}">${blocked?'Fornecedor bloqueado':p.stock>0?'Ativo':'Esgotado'}</span></td><td><div class="admin-actions"><button onclick="adminViewProduct(${p.id})">Ver</button><button class="danger" onclick="adminRemoveProduct(${p.id})">Remover</button></div></td></tr>`}).join("")}</tbody></table>`;
  const rows=interests.slice().reverse().map(i=>{const su=SUPPLIERS_DB.find(x=>Number(x.id)===Number(i.supplierId));return `<tr><td>${escapeHtml(i.date||"-")}</td><td>${escapeHtml(i.clientName||"Cliente")}</td><td>${escapeHtml(i.productName||"Produto")}</td><td>${escapeHtml(su?.empresa||"-")}</td><td>${i.quantity}</td><td>${formatBRL(i.value||0)}</td></tr>`}).join("");document.getElementById("adminInterestsTable").innerHTML=rows?`<table><thead><tr><th>Data</th><th>Cliente</th><th>Produto</th><th>Fornecedor</th><th>Qtd.</th><th>Valor estimado</th></tr></thead><tbody>${rows}</tbody></table>`:'<div class="admin-empty">Nenhum interesse registrado ainda. Use “Simular pedido” no perfil Cliente.</div>';
  document.getElementById("adminNotifications").innerHTML=getAdminNotifications().map(n=>`<div class="admin-log"><span style="font-size:20px">${n.icon}</span><span>${escapeHtml(n.text)}</span></div>`).join("");
  document.getElementById("adminLogs").innerHTML=logs.length?logs.map(l=>`<div class="admin-log"><small>${escapeHtml(l.date)}</small><span>${escapeHtml(l.text)}</span></div>`).join(""):'<div class="admin-empty">Nenhuma atividade registrada.</div>';
}
function openSettings(){
  const account=getLoggedAccount();if(!account){showToast("Entre em uma conta para acessar as configurações.");return;}
  if(account.role==="admin"){document.querySelectorAll(".supplier-only,.client-only").forEach(el=>el.style.display="none");document.getElementById("settingsName").value=localStorage.getItem("vitrineAdminName")||account.nome||"Administrador Vitrine Pro";document.getElementById("settingsEmail").value=account.email;document.getElementById("settingsPhone").value="";document.getElementById("settingsCity").value="";document.getElementById("settingsState").value="";document.getElementById("settingsCnpj").value="";document.getElementById("settingsAddress").value="";document.getElementById("settingsDescription").value="Administrador da plataforma";document.getElementById("settingsWhatsapp").value="";document.getElementById("settingsLanguage").value=getPref("language","pt-BR");document.getElementById("settingsTheme").value=getPref("theme","light");document.getElementById("settingsFontSize").value=getPref("fontSize","normal");document.getElementById("settingsOnlyAvailable").checked=false;document.getElementById("settingsShowStock").checked=true;document.getElementById("settingsSort").value="default";document.getElementById("notifySystem").checked=getPref("notifySystem","true")==="true";document.getElementById("notifyProducts").checked=false;document.getElementById("notifyInterest").checked=false;document.getElementById("notifyEmail").checked=getPref("notifyEmail","false")==="true";document.getElementById("settingsLastAccess").textContent=localStorage.getItem("vitrineLastAccess_admin_"+account.id)||"Ainda não registrado";showSettingsTab("perfil",document.querySelector(".settings-tab"));document.getElementById("settingsModal").classList.add("open");return;}
  const role=account.role,isSupplier=role==="fornecedor";document.querySelectorAll(".supplier-only").forEach(el=>el.style.display=isSupplier?"block":"none");document.querySelectorAll(".client-only").forEach(el=>el.style.display=isSupplier?"none":"flex");const source=isSupplier?SUPPLIERS_DB.find(x=>Number(x.id)===Number(account.id)):CLIENTS_DB.find(x=>Number(x.id)===Number(account.id));const overrides=getClientOverrides()[account.id]||{};const data=isSupplier?(source||{}):Object.assign({},source||{},overrides);document.getElementById("settingsName").value=data.responsavel||data.nome||account.nome||"";document.getElementById("settingsEmail").value=data.email||account.email||"";document.getElementById("settingsPhone").value=data.telefone||"";document.getElementById("settingsCity").value=data.cidade||"";document.getElementById("settingsState").value=data.estado||"";document.getElementById("settingsCnpj").value=data.cnpj||"";document.getElementById("settingsAddress").value=data.endereco||"";document.getElementById("settingsDescription").value=data.descricao||"";document.getElementById("settingsWhatsapp").value=data.whatsapp||data.telefone||"";document.getElementById("settingsLanguage").value=getPref("language",localStorage.getItem("vitrineLanguage")||"pt-BR");document.getElementById("settingsTheme").value=getPref("theme","light");document.getElementById("settingsFontSize").value=getPref("fontSize","normal");document.getElementById("settingsOnlyAvailable").checked=getPref("onlyAvailable","false")==="true";document.getElementById("settingsShowStock").checked=getPref("showStock","true")==="true";document.getElementById("settingsSort").value=getPref("sort","default");document.getElementById("notifySystem").checked=getPref("notifySystem","true")==="true";document.getElementById("notifyProducts").checked=getPref("notifyProducts","true")==="true";document.getElementById("notifyInterest").checked=getPref("notifyInterest","true")==="true";document.getElementById("notifyEmail").checked=getPref("notifyEmail","false")==="true";document.getElementById("settingsLastAccess").textContent=localStorage.getItem("vitrineLastAccess_"+role+"_"+account.id)||"Ainda não registrado";document.getElementById("settingsCurrentPassword").value="";document.getElementById("settingsNewPassword").value="";document.getElementById("settingsNewPassword2").value="";showSettingsTab("perfil",document.querySelector(".settings-tab"));renderInterestList();document.getElementById("settingsModal").classList.add("open");
}
function saveSettingsV5(){const account=getLoggedAccount();if(!account)return;const name=document.getElementById("settingsName").value.trim()||"Usuário Vitrine";if(account.role==="admin"){localStorage.setItem("vitrineAdminName",name);setPref("language",document.getElementById("settingsLanguage").value);localStorage.setItem("vitrineLanguage",document.getElementById("settingsLanguage").value);setPref("theme",document.getElementById("settingsTheme").value);setPref("fontSize",document.getElementById("settingsFontSize").value);setPref("notifySystem",document.getElementById("notifySystem").checked);setPref("notifyEmail",document.getElementById("notifyEmail").checked);sessionStorage.setItem("vitrineLoggedUser",JSON.stringify(Object.assign({},account,{nome:name})));document.getElementById("adminName").textContent=name;applyV5Appearance();closeSettings();showToast("Configurações do ADM salvas com sucesso.");return;}/* fluxo V5 para cliente/fornecedor */const role=account.role,isSupplier=role==="fornecedor";if(isSupplier){const supplier=SUPPLIERS_DB.find(x=>Number(x.id)===Number(account.id));if(!supplier){showToast("Fornecedor não encontrado.");return;}supplier.responsavel=name;supplier.telefone=document.getElementById("settingsPhone").value.trim();supplier.cidade=document.getElementById("settingsCity").value.trim();supplier.estado=document.getElementById("settingsState").value.trim().toUpperCase();supplier.cnpj=document.getElementById("settingsCnpj").value.trim();supplier.endereco=document.getElementById("settingsAddress").value.trim();supplier.descricao=document.getElementById("settingsDescription").value.trim();supplier.whatsapp=document.getElementById("settingsWhatsapp").value.trim();saveSuppliers();document.getElementById("supplierName").textContent=name;}else{const all=getClientOverrides();all[account.id]={nome:name,telefone:document.getElementById("settingsPhone").value.trim(),cidade:document.getElementById("settingsCity").value.trim(),estado:document.getElementById("settingsState").value.trim().toUpperCase()};saveClientOverrides(all);document.getElementById("clientName").textContent=name;}setPref("language",document.getElementById("settingsLanguage").value);localStorage.setItem("vitrineLanguage",document.getElementById("settingsLanguage").value);setPref("theme",document.getElementById("settingsTheme").value);setPref("fontSize",document.getElementById("settingsFontSize").value);setPref("onlyAvailable",document.getElementById("settingsOnlyAvailable").checked);setPref("showStock",document.getElementById("settingsShowStock").checked);setPref("sort",document.getElementById("settingsSort").value);setPref("notifySystem",document.getElementById("notifySystem").checked);setPref("notifyProducts",document.getElementById("notifyProducts").checked);setPref("notifyInterest",document.getElementById("notifyInterest").checked);setPref("notifyEmail",document.getElementById("notifyEmail").checked);applyV5Appearance();if(role==="cliente")renderProducts();else renderSupplier();closeSettings();showToast("Configurações salvas com sucesso.");}
function changeUserPassword(){const account=getLoggedAccount();if(!account)return;const current=document.getElementById("settingsCurrentPassword").value,newPass=document.getElementById("settingsNewPassword").value,confirm=document.getElementById("settingsNewPassword2").value;if(account.role==="admin"){if(current!==accountPasswordAdmin())return showToast("A senha atual está incorreta.");if(newPass.length<6)return showToast("A nova senha deve ter pelo menos 6 caracteres.");if(newPass!==confirm)return showToast("As novas senhas não são iguais.");ADMINS_DB[0].senha=newPass;sessionStorage.setItem("vitrineAdminPassword",newPass);showToast("Senha do ADM alterada com sucesso.");document.getElementById("settingsCurrentPassword").value="";document.getElementById("settingsNewPassword").value="";document.getElementById("settingsNewPassword2").value="";return;}/* Mantém função original para cliente/fornecedor */const user=account.role==="fornecedor"?SUPPLIERS_DB.find(x=>Number(x.id)===Number(account.id)):CLIENTS_DB.find(x=>Number(x.id)===Number(account.id));if(!user){showToast("Conta não encontrada.");return;}const overrides=getClientOverrides();const effective=account.role==="cliente"&&overrides[account.id]?.senha?overrides[account.id].senha:user.senha;if(current!==effective)return showToast("A senha atual está incorreta.");if(newPass.length<6)return showToast("A nova senha deve ter pelo menos 6 caracteres.");if(newPass!==confirm)return showToast("As novas senhas não são iguais.");if(account.role==="fornecedor"){user.senha=newPass;saveSuppliers();}else{const all=getClientOverrides();all[account.id]=Object.assign({},all[account.id]||{},{senha:newPass});saveClientOverrides(all);}showToast("Senha alterada com sucesso.");document.getElementById("settingsCurrentPassword").value="";document.getElementById("settingsNewPassword").value="";document.getElementById("settingsNewPassword2").value="";}
function accountPasswordAdmin(){return sessionStorage.getItem("vitrineAdminPassword")||ADMINS_DB[0].senha;}



/* ===== VITRINEPRO_09 - FAVORITOS DE PRODUTOS E FORNECEDORES ===== */
function getFavoriteKey(){
  const account=getLoggedAccount();
  return 'vitrineFavorites_'+(account && account.role==='cliente' ? account.id : 'guest');
}
function getFavorites(){
  try{
    const data=JSON.parse(localStorage.getItem(getFavoriteKey())||'{}');
    return {products:Array.isArray(data.products)?data.products.map(Number):[],suppliers:Array.isArray(data.suppliers)?data.suppliers.map(Number):[]};
  }catch(e){return {products:[],suppliers:[]};}
}
function saveFavorites(data){localStorage.setItem(getFavoriteKey(),JSON.stringify({products:[...new Set(data.products.map(Number))],suppliers:[...new Set(data.suppliers.map(Number))]}));updateFavoriteBadges();}
function isFavoriteProduct(id){return getFavorites().products.includes(Number(id));}
function isFavoriteSupplier(id){return getFavorites().suppliers.includes(Number(id));}
function toggleFavoriteProduct(id){
  const f=getFavorites(),n=Number(id),i=f.products.indexOf(n);
  if(i>=0){f.products.splice(i,1);showToast('Produto removido dos favoritos.');}
  else{f.products.push(n);showToast('Produto adicionado aos favoritos.');}
  saveFavorites(f);
  if(selectedSupplierId!==null) renderSupplierProducts(selectedSupplierId); else renderProducts();
}
function toggleFavoriteSupplier(id){
  const f=getFavorites(),n=Number(id),i=f.suppliers.indexOf(n);
  if(i>=0){f.suppliers.splice(i,1);showToast('Fornecedor removido dos favoritos.');}
  else{f.suppliers.push(n);showToast('Fornecedor adicionado aos favoritos.');}
  saveFavorites(f);
  if(selectedSupplierId!==null) renderSupplierProducts(selectedSupplierId); else renderProducts();
}
function updateFavoriteBadges(){
  const total=(()=>{const f=getFavorites();return f.products.length+f.suppliers.length;})();
  ['favoriteBadge','favoriteBadgeTop'].forEach(id=>{const el=document.getElementById(id);if(el)el.textContent=total;});
}
function favoriteProductButton(p){
  const active=isFavoriteProduct(p.id);
  return `<button class="favorite-btn ${active?'active':''}" type="button" title="${active?'Remover dos favoritos':'Adicionar aos favoritos'}" onclick="event.stopPropagation();toggleFavoriteProduct(${Number(p.id)})">${active?'♥':'♡'}</button>`;
}
function favoriteSupplierButton(s){
  const active=isFavoriteSupplier(s.id);
  return `<button class="favorite-btn supplier-favorite ${active?'active':''}" type="button" title="${active?'Remover fornecedor dos favoritos':'Favoritar fornecedor'}" onclick="event.stopPropagation();toggleFavoriteSupplier(${Number(s.id)})">${active?'♥':'♡'}</button>`;
}
function renderSupplierProducts(supplierId){
  const container=document.getElementById('productGrid'); if(!container)return;
  const supplier=SUPPLIERS_DB.find(s=>Number(s.id)===Number(supplierId));
  if(!supplier){selectedSupplierId=null;renderProducts();return;}
  selectedSupplierId=Number(supplier.id);
  const supplierProducts=getSupplierProductList(supplier.id);
  const showStock=getPref('showStock','true')==='true';
  const count=document.getElementById('productCount'); if(count)count.textContent=`${supplierProducts.length} produto${supplierProducts.length===1?'':'s'}`;
  let html=`<button class="supplier-back" onclick="selectedSupplierId=null;renderProducts()">← Voltar para fornecedores</button>`;
  html+=`<section class="store-section"><div class="store-header"><div class="store-title"><div class="store-avatar">${escapeHtml(supplierInitials(supplier.empresa))}</div><div><h3>${escapeHtml(supplier.empresa)}</h3><p>Responsável: ${escapeHtml(supplier.responsavel||'Não informado')}</p></div></div><div style="display:flex;align-items:center;gap:10px"><div class="store-count">${supplierProducts.length} produto${supplierProducts.length===1?'':'s'}</div>${favoriteSupplierButton(supplier)}</div></div>`;
  html+=`<div class="supplier-products-head"><div><h3>Produtos cadastrados</h3><p>Produtos publicados por este fornecedor na Vitrine Pro.</p></div></div>`;
  if(!supplierProducts.length){html+=`<div class="empty">Este fornecedor ainda não possui produtos disponíveis no catálogo.</div></section>`;container.innerHTML=html;return;}
  html+=`<div class="product-grid">${supplierProducts.map(p=>`<article class="product-card"><div class="product-image">${p.emoji||'📦'}</div><div class="product-info"><div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><div class="product-category">${escapeHtml(p.category)} · ${escapeHtml(p.brand||'')}</div>${favoriteProductButton(p)}</div><h3>${escapeHtml(p.model||p.name)}</h3><p>${escapeHtml(p.description||'Produto disponível no catálogo.')}</p><div class="price">${formatBRL(p.price)}</div><div class="stock">${p.stock>0?(showStock?'Disponível: '+p.stock+' unidades':'Disponível'):'Produto esgotado'}</div><div class="product-actions"><button class="cart-add-btn" ${p.stock<=0?'disabled':''} onclick="addToCart(${p.id})">${p.stock>0?'Adicionar à simulação':'Esgotado'}</button><button class="cart-icon-btn" title="Adicionar à simulação" ${p.stock<=0?'disabled':''} onclick="addToCart(${p.id})">🛒</button></div></div></article>`).join('')}</div></section>`;
  container.innerHTML=html;updateFavoriteBadges();
}
function renderProducts(){
  const container=document.getElementById('productGrid');if(!container)return;
  if(selectedSupplierId!==null){renderSupplierProducts(selectedSupplierId);return;}
  const searchEl=document.getElementById('supplierSearch'),search=searchEl?searchEl.value.toLowerCase().trim():'';
  const suppliers=[...SUPPLIERS_DB].sort((a,b)=>String(a.empresa||'').localeCompare(String(b.empresa||''))).filter(s=>[s.empresa,s.responsavel,s.telefone,s.whatsapp,s.email,s.endereco,s.cidade,s.estado,s.descricao].join(' ').toLowerCase().includes(search));
  const count=document.getElementById('productCount');if(count)count.textContent=`${suppliers.length} fornecedor${suppliers.length===1?'':'es'}`;
  if(!suppliers.length){container.innerHTML='<div class="empty">Nenhum fornecedor encontrado para a busca.</div>';updateFavoriteBadges();return;}
  container.innerHTML=`<div class="supplier-directory-grid">${suppliers.map(s=>{const ps=products.filter(p=>Number(p.supplierId)===Number(s.id));const phone=s.whatsapp||s.telefone||'Não informado';const location=s.endereco||`${s.cidade||''}${s.cidade&&s.estado?' - ':''}${s.estado||''}`||'Não informado';return `<article class="supplier-directory-card" onclick="renderSupplierProducts(${Number(s.id)})"><div class="supplier-directory-head"><div class="supplier-directory-avatar">${escapeHtml(supplierInitials(s.empresa))}</div><div style="flex:1;min-width:0"><h3>${escapeHtml(s.empresa||'Fornecedor')}</h3><p>Responsável: ${escapeHtml(s.responsavel||'Não informado')}</p></div>${favoriteSupplierButton(s)}</div><div class="supplier-contact-grid"><div class="supplier-contact-item"><small>Telefone</small><strong>${escapeHtml(phone)}</strong></div><div class="supplier-contact-item"><small>E-mail</small><strong>${escapeHtml(s.email||'Não informado')}</strong></div><div class="supplier-contact-item"><small>Localização</small><strong>${escapeHtml(location)}</strong></div><div class="supplier-contact-item"><small>Produtos</small><strong>${ps.length} cadastrado${ps.length===1?'':'s'}</strong></div></div><p class="supplier-directory-description">${escapeHtml(s.descricao||'Fornecedor cadastrado na Vitrine Pro.')}</p><button class="supplier-view-btn" type="button" onclick="event.stopPropagation();renderSupplierProducts(${Number(s.id)})">Ver produtos cadastrados</button></article>`;}).join('')}</div>`;
  updateFavoriteBadges();
}
function renderFavorites(){
  selectedSupplierId=null;
  const container=document.getElementById('productGrid');if(!container)return;
  const f=getFavorites();
  const favSuppliers=f.suppliers.map(id=>SUPPLIERS_DB.find(s=>Number(s.id)===id)).filter(Boolean);
  const favProducts=f.products.map(id=>products.find(p=>Number(p.id)===id)).filter(Boolean);
  const count=document.getElementById('productCount');if(count)count.textContent=`${favSuppliers.length+favProducts.length} favorito${favSuppliers.length+favProducts.length===1?'':'s'}`;
  let html=`<div class="favorites-head"><div><h2>❤️ Meus favoritos</h2><p style="margin:5px 0 0;color:#777;font-size:13px">Acesse rapidamente fornecedores e produtos que você marcou.</p></div><button class="supplier-back" style="margin:0" onclick="renderProducts()">← Voltar ao catálogo</button></div>`;
  html+=`<div class="favorites-tabs"><button class="favorites-tab active" type="button">Fornecedores (${favSuppliers.length})</button><button class="favorites-tab" type="button" onclick="renderFavoriteProducts()">Produtos (${favProducts.length})</button></div>`;
  if(!favSuppliers.length)html+='<div class="favorite-empty">Você ainda não favoritou nenhum fornecedor.<br><small>Clique no ♡ de uma loja para adicioná-la aqui.</small></div>';
  else html+=`<div class="supplier-directory-grid">${favSuppliers.map(s=>{const ps=products.filter(p=>Number(p.supplierId)===Number(s.id));return `<article class="supplier-directory-card" onclick="renderSupplierProducts(${Number(s.id)})"><div class="supplier-directory-head"><div class="supplier-directory-avatar">${escapeHtml(supplierInitials(s.empresa))}</div><div style="flex:1"><h3>${escapeHtml(s.empresa||'Fornecedor')}</h3><p>Responsável: ${escapeHtml(s.responsavel||'Não informado')}</p></div>${favoriteSupplierButton(s)}</div><div class="supplier-contact-grid"><div class="supplier-contact-item"><small>Telefone</small><strong>${escapeHtml(s.whatsapp||s.telefone||'Não informado')}</strong></div><div class="supplier-contact-item"><small>E-mail</small><strong>${escapeHtml(s.email||'Não informado')}</strong></div><div class="supplier-contact-item"><small>Localização</small><strong>${escapeHtml(s.endereco||((s.cidade||'')+(s.cidade&&s.estado?' - ':'')+(s.estado||''))||'Não informado')}</strong></div><div class="supplier-contact-item"><small>Produtos</small><strong>${ps.length} cadastrado${ps.length===1?'':'s'}</strong></div></div><button class="supplier-view-btn" type="button" onclick="event.stopPropagation();renderSupplierProducts(${Number(s.id)})">Ver produtos cadastrados</button></article>`;}).join('')}</div>`;
  container.innerHTML=html;updateFavoriteBadges();
}
function renderFavoriteProducts(){
  const container=document.getElementById('productGrid');if(!container)return;const f=getFavorites();const favProducts=f.products.map(id=>products.find(p=>Number(p.id)===id)).filter(Boolean);const count=document.getElementById('productCount');if(count)count.textContent=`${favProducts.length} produto${favProducts.length===1?'':'s'} favorito${favProducts.length===1?'':'s'}`;
  let html=`<div class="favorites-head"><div><h2>❤️ Meus favoritos</h2><p style="margin:5px 0 0;color:#777;font-size:13px">Produtos que você marcou para encontrar depois.</p></div><button class="supplier-back" style="margin:0" onclick="renderProducts()">← Voltar ao catálogo</button></div><div class="favorites-tabs"><button class="favorites-tab" type="button" onclick="renderFavorites()">Fornecedores (${f.suppliers.length})</button><button class="favorites-tab active" type="button">Produtos (${favProducts.length})</button></div>`;
  if(!favProducts.length){html+='<div class="favorite-empty">Você ainda não favoritou nenhum produto.<br><small>Clique no ♡ de um produto para adicioná-lo aqui.</small></div>';container.innerHTML=html;updateFavoriteBadges();return;}
  const showStock=getPref('showStock','true')==='true';
  html+=`<div class="product-grid">${favProducts.map(p=>`<article class="product-card"><div class="product-image">${p.emoji||'📦'}</div><div class="product-info"><div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><div class="product-category">${escapeHtml(p.category)} · ${escapeHtml(p.brand||'')}</div>${favoriteProductButton(p)}</div><h3>${escapeHtml(p.model||p.name)}</h3><p>${escapeHtml(p.description||'Produto disponível no catálogo.')}</p><div class="price">${formatBRL(p.price)}</div><div class="stock">${p.stock>0?(showStock?'Disponível: '+p.stock+' unidades':'Disponível'):'Produto esgotado'}</div><div class="product-actions"><button class="cart-add-btn" ${p.stock<=0?'disabled':''} onclick="addToCart(${p.id})">${p.stock>0?'Adicionar à simulação':'Esgotado'}</button><button class="cart-icon-btn" ${p.stock<=0?'disabled':''} onclick="addToCart(${p.id})">🛒</button></div></div></article>`).join('')}</div>`;
  container.innerHTML=html;updateFavoriteBadges();
}
updateFavoriteBadges();
