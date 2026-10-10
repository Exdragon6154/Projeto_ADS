const suppliers = [
  {
    id: 1,
    name: "Grupo Fiori",
    initials: "GF",
    category: "Café & Snacks",
    phone: "+55 (11) 98888-4400",
    email: "contato@grupofiori.com.br",
    zone: "São Paulo",
    description: "Especialista em cafeterias premium, mix de padaria e itens gourmet para clientes corporativos.",
    products: [1, 2, 3, 4]
  },
  {
    id: 2,
    name: "Norte Verde",
    initials: "NV",
    category: "Agronegócio",
    phone: "+55 (21) 99888-1100",
    email: "atendimento@norteverde.com",
    zone: "Rio de Janeiro",
    description: "Fronteira de frutas frescas, hortifruti e produtos orgânicos para mercados de alto giro.",
    products: [5, 6, 7]
  },
  {
    id: 3,
    name: "LumiTech",
    initials: "LT",
    category: "Eletrônicos",
    phone: "+55 (31) 97666-3311",
    email: "vendas@lumitech.com",
    zone: "Belo Horizonte",
    description: "Linha de eletrônicos domésticos, acessórios inteligentes e tecnologia para operação comercial.",
    products: [8, 9, 10]
  },
  {
    id: 4,
    name: "Bela Casa",
    initials: "BC",
    category: "Casa & Acessórios",
    phone: "+55 (41) 98222-3010",
    email: "contato@belacasa.com.br",
    zone: "Curitiba",
    description: "Produtos de decoração, utilidades e itens para apresentação premium de ambientes corporativos.",
    products: [11, 12]
  }
];

const products = [
  { id: 1, supplierId: 1, name: "Latte Especial", category: "Café", emoji: "☕", price: 18.9, stock: 42, description: "Blend intenso com notas de chocolate e caramelo.", favorite: true },
  { id: 2, supplierId: 1, name: "Cookie de Chocolate", category: "Bolos", emoji: "🍪", price: 16.5, stock: 60, description: "Cookie artesanal com cobertura de chocolate belga.", favorite: false },
  { id: 3, supplierId: 1, name: "Kit Chás Premium", category: "Bebidas", emoji: "🍵", price: 54.0, stock: 18, description: "Seleção de chás de origem e aromatização suave.", favorite: true },
  { id: 4, supplierId: 1, name: "Biscoito de Laranja", category: "Bolos", emoji: "🥐", price: 14.2, stock: 24, description: "Receita artesanal com cítrico e textura crocante.", favorite: false },

  { id: 5, supplierId: 2, name: "Cesta de Frutas", category: "Acessórios", emoji: "🍊", price: 58.0, stock: 11, description: "Kit com frutas selecionadas para atendimento premium.", favorite: false },
  { id: 6, supplierId: 2, name: "Mix de Folhas", category: "Acessórios", emoji: "🥬", price: 26.5, stock: 28, description: "Hortaliças selecionadas e frescas para cardápios.", favorite: true },
  { id: 7, supplierId: 2, name: "Granola Orgânica", category: "Acessórios", emoji: "🥣", price: 32.0, stock: 35, description: "Granola com sementes e frutas secas da região.", favorite: false },

  { id: 8, supplierId: 3, name: "Mini Smart Speaker", category: "Eletrônicos", emoji: "🔊", price: 126.0, stock: 16, description: "Alto-falante compacto com conectividade Bluetooth.", favorite: false },
  { id: 9, supplierId: 3, name: "Monitor 27'", category: "Eletrônicos", emoji: "🖥️", price: 780.0, stock: 8, description: "Tela ultrafina com qualidade 4K para escritórios.", favorite: false },
  { id: 10, supplierId: 3, name: "Cabo USB-C 2m", category: "Eletrônicos", emoji: "🔌", price: 29.9, stock: 73, description: "Cabo com alta resistência e carregamento rápido.", favorite: true },

  { id: 11, supplierId: 4, name: "Vaso Minimalista", category: "Acessórios", emoji: "🏺", price: 44.0, stock: 30, description: "Decoração para ambientes premium com acabamento suave.", favorite: true },
  { id: 12, supplierId: 4, name: "Kit de Cozinha", category: "Acessórios", emoji: "🍽️", price: 88.0, stock: 19, description: "Conjunto funcional com design clássico e superprático.", favorite: false }
];

const adminLogs = [
  { time: "08:34", action: "Pedido #20481 aprovado por financeiro." },
  { time: "08:18", action: "Fornecedor Grupo Fiori enviado aviso de estoque baixo." },
  { time: "07:55", action: "Cliente Maria Silva acessou carrinho com 3 itens." },
  { time: "07:42", action: "Nova integração com LumiTech concluída." }
];

const state = {
  role: "cliente",
  currentPanel: "marketplace",
  filter: "Todos",
  search: "",
  selectedSupplier: null,
  cart: [],
  favorites: {
    products: [1, 3, 6, 10, 11],
    suppliers: [1, 3]
  },
  favoriteTab: "produtos"
};

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL"
});

function formatCurrency(value) {
  return currency.format(value);
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 1800);
}

function setActiveRole(role) {
  state.role = role;
  document.querySelectorAll(".role-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.role === role);
  });

  const welcome = document.getElementById("welcomeTitle");
  const labels = {
    cliente: "Acesse sua conta",
    fornecedor: "Área do fornecedor",
    admin: "Acesso administrativo"
  };
  welcome.textContent = labels[role] || "Acesse sua conta";
}

function openPanel(name) {
  state.currentPanel = name;

  document.querySelectorAll(".nav-link").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.panel === name);
  });

  document.querySelectorAll(".panel-section").forEach((section) => {
    const id = section.id;
    const match = {
      marketplace: "marketplaceSection",
      suppliers: "suppliersSection",
      favorites: "favoritesSection",
      admin: "adminSection"
    }[name];

    section.style.display = id === match ? "block" : "none";
  });

  if (name === "admin") {
    renderAdminLogs();
  }
}

function renderProducts() {
  const grid = document.getElementById("productGrid");
  const count = document.getElementById("productCountText");

  let filtered = products.filter((product) => {
    const matchesFilter = state.filter === "Todos" || product.category === state.filter;
    const matchesSearch =
      !state.search ||
      product.name.toLowerCase().includes(state.search.toLowerCase()) ||
      product.category.toLowerCase().includes(state.search.toLowerCase()) ||
      suppliers.find((s) => s.id === product.supplierId)?.name.toLowerCase().includes(state.search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  count.textContent = `${filtered.length} itens`;

  if (!filtered.length) {
    grid.innerHTML = '<div class="empty">Nenhum produto encontrado para sua busca.</div>';
    return;
  }

  grid.innerHTML = filtered.map((product) => {
    const supplier = suppliers.find((s) => s.id === product.supplierId);
    const isFav = state.favorites.products.includes(product.id);
    return `
      <article class="product-card">
        <div class="product-image">${product.emoji}</div>
        <div class="product-info">
          <div class="product-category">${product.category}</div>
          <h3>${product.name}</h3>
          <p>${supplier?.name || "Fornecedor"} · ${product.description}</p>
          <div class="price">${formatCurrency(product.price)}</div>
          <div class="stock">Estoque: ${product.stock} unidades</div>
          <div class="product-actions">
            <button class="cart-add-btn" data-product-id="${product.id}" type="button" ${product.stock === 0 ? "disabled" : ""}>Adicionar</button>
            <button class="favorite-btn ${isFav ? "active" : ""}" data-favorite-product="${product.id}" type="button" aria-label="Favoritar">${isFav ? "♥" : "♡"}</button>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

function renderSuppliers() {
  const grid = document.getElementById("supplierGrid");

  grid.innerHTML = suppliers.map((supplier) => {
    const productsCount = supplier.products.length;
    const isFav = state.favorites.suppliers.includes(supplier.id);

    return `
      <article class="supplier-directory-card" data-supplier-id="${supplier.id}">
        <div class="supplier-directory-head">
          <div class="supplier-directory-avatar">${supplier.initials}</div>
          <div>
            <h3>${supplier.name}</h3>
            <p>${supplier.category}</p>
          </div>
          <button class="favorite-btn supplier-favorite ${isFav ? "active" : ""}" data-favorite-supplier="${supplier.id}" type="button" aria-label="Favoritar fornecedor">${isFav ? "♥" : "♡"}</button>
        </div>

        <div class="supplier-contact-grid">
          <div class="supplier-contact-item">
            <small>Telefone</small>
            <strong>${supplier.phone}</strong>
          </div>
          <div class="supplier-contact-item">
            <small>Região</small>
            <strong>${supplier.zone}</strong>
          </div>
        </div>

        <p class="supplier-directory-description">${supplier.description}</p>

        <button class="supplier-view-btn" data-open-supplier="${supplier.id}" type="button">Ver catálogo</button>
      </article>
    `;
  }).join("");
}

function renderSupplierDetail() {
  const supplier = suppliers.find((s) => s.id === state.selectedSupplier);
  const root = document.getElementById("suppliersSection");
  if (!supplier) return;

  const existing = document.getElementById("supplierDetailView");
  if (existing) existing.remove();

  const detail = document.createElement("div");
  detail.id = "supplierDetailView";
  detail.className = "store-section";
  detail.innerHTML = `
    <button class="supplier-back" id="backToSuppliers" type="button">← Voltar</button>
    <div class="store-header">
      <div class="store-title">
        <div class="store-avatar">${supplier.initials}</div>
        <div>
          <h3>${supplier.name}</h3>
          <p>${supplier.category} · ${supplier.zone}</p>
        </div>
      </div>
      <div class="store-count">${supplier.products.length} produtos em catálogo</div>
    </div>

    <div class="supplier-products-head">
      <div>
        <h3>Catálogo do fornecedor</h3>
        <p>${supplier.description}</p>
      </div>
    </div>

    <div class="product-grid">
      ${supplier.products
        .map((productId) => {
          const product = products.find((p) => p.id === productId);
          const isFav = state.favorites.products.includes(product.id);
          return `
            <article class="product-card">
              <div class="product-image">${product.emoji}</div>
              <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="price">${formatCurrency(product.price)}</div>
                <div class="stock">Estoque: ${product.stock} unidades</div>
                <div class="product-actions">
                  <button class="cart-add-btn" data-product-id="${product.id}" type="button">Adicionar</button>
                  <button class="favorite-btn ${isFav ? "active" : ""}" data-favorite-product="${product.id}" type="button">${isFav ? "♥" : "♡"}</button>
                </div>
              </div>
            </article>
          `;
        })
        .join("")}
    </div>
  `;

  root.appendChild(detail);
}

function renderFavorites() {
  const container = document.getElementById("favoritesContent");
  const tab = state.favoriteTab;

  if (tab === "produtos") {
    const favProducts = products.filter((product) => state.favorites.products.includes(product.id));
    if (!favProducts.length) {
      container.innerHTML = '<div class="favorite-empty">Você ainda não favoritou nenhum produto.</div>';
      return;
    }

    container.innerHTML = `
      <div class="product-grid">
        ${favProducts.map((product) => {
          const supplier = suppliers.find((s) => s.id === product.supplierId);
          return `
            <article class="product-card">
              <div class="product-image">${product.emoji}</div>
              <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3>${product.name}</h3>
                <p>${supplier.name}</p>
                <div class="price">${formatCurrency(product.price)}</div>
                <div class="product-actions">
                  <button class="cart-add-btn" data-product-id="${product.id}" type="button">Adicionar</button>
                  <button class="favorite-btn active" data-favorite-product="${product.id}" type="button">♥</button>
                </div>
              </div>
            </article>
          `;
        }).join("")}
      </div>
    `;
    return;
  }

  const favSuppliers = suppliers.filter((supplier) => state.favorites.suppliers.includes(supplier.id));
  if (!favSuppliers.length) {
    container.innerHTML = '<div class="favorite-empty">Você ainda não favoritou nenhum fornecedor.</div>';
    return;
  }

  container.innerHTML = `
    <div class="supplier-directory-grid">
      ${favSuppliers.map((supplier) => `
        <article class="supplier-directory-card" data-supplier-id="${supplier.id}">
          <div class="supplier-directory-head">
            <div class="supplier-directory-avatar">${supplier.initials}</div>
            <div>
              <h3>${supplier.name}</h3>
              <p>${supplier.category}</p>
            </div>
            <button class="favorite-btn supplier-favorite active" data-favorite-supplier="${supplier.id}" type="button">♥</button>
          </div>
          <p class="supplier-directory-description">${supplier.description}</p>
          <button class="supplier-view-btn" data-open-supplier="${supplier.id}" type="button">Ver catálogo</button>
        </article>
      `).join("")}
    </div>
  `;
}

function renderAdminLogs() {
  const container = document.getElementById("adminLogs");
  container.innerHTML = adminLogs.map((log) =>
    `<div class="admin-log"><small>${log.time}</small><span>${log.action}</span></div>`
  ).join("");
}

function updateCart() {
  const drawer = document.getElementById("cartItems");
  const totalEl = document.getElementById("cartTotal");
  const simulateBtn = document.getElementById("simulateBtn");

  if (!state.cart.length) {
    drawer.innerHTML = '<div class="cart-empty">Seu carrinho está vazio.</div>';
    totalEl.textContent = "R$ 0,00";
    simulateBtn.disabled = true;
    return;
  }

  simulateBtn.disabled = false;
  const total = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  drawer.innerHTML = state.cart.map((item) => `
    <div class="cart-item">
      <div class="cart-item-image">${item.emoji}</div>
      <div>
        <h4>${item.name}</h4>
        <small>${item.category}</small>
        <div class="qty-controls">
          <button data-cart-minus="${item.id}" type="button">−</button>
          <span>${item.quantity}</span>
          <button data-cart-plus="${item.id}" type="button">+</button>
        </div>
        <button class="cart-remove" data-cart-remove="${item.id}" type="button">Remover</button>
      </div>
      <div class="cart-item-price">${formatCurrency(item.price * item.quantity)}</div>
    </div>
  `).join("");

  totalEl.textContent = formatCurrency(total);
}

function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  const existing = state.cart.find((item) => item.id === productId);
  if (existing) {
    if (existing.quantity >= product.stock) {
      showToast("Estoque máximo atingido.");
      return;
    }
    existing.quantity += 1;
  } else {
    state.cart.push({ ...product, quantity: 1 });
  }

  updateCart();
  showToast(`${product.name} adicionado ao carrinho.`);
}

function changeCartQuantity(productId, delta) {
  const item = state.cart.find((i) => i.id === productId);
  if (!item) return;

  item.quantity += delta;

  if (item.quantity <= 0) {
    state.cart = state.cart.filter((i) => i.id !== productId);
  }

  updateCart();
}

function toggleFavorite(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  if (state.favorites.products.includes(productId)) {
    state.favorites.products = state.favorites.products.filter((id) => id !== productId);
    showToast(`${product.name} removido dos favoritos.`);
  } else {
    state.favorites.products.push(productId);
    showToast(`${product.name} adicionado aos favoritos.`);
  }

  renderProducts();
  renderFavorites();
  renderSupplierDetail();
}

function toggleFavoriteSupplier(supplierId) {
  if (state.favorites.suppliers.includes(supplierId)) {
    state.favorites.suppliers = state.favorites.suppliers.filter((id) => id !== supplierId);
  } else {
    state.favorites.suppliers.push(supplierId);
  }

  renderSuppliers();
  renderFavorites();
}

function login() {
  const role = state.role;
  const email = document.getElementById("emailInput").value.trim();
  const password = document.getElementById("passwordInput").value.trim();

  if (!email || !password) {
    showToast("Preencha e-mail e senha.");
    return;
  }

  document.getElementById("loginPage").style.display = "none";
  document.getElementById("appView").classList.add("active");

  if (role === "fornecedor") {
    document.getElementById("marketplaceSection").style.display = "block";
    document.getElementById("suppliersSection").style.display = "none";
    state.currentPanel = "marketplace";
  } else if (role === "admin") {
    openPanel("admin");
  } else {
    openPanel("marketplace");
  }

  const accountName = {
    cliente: "Maria Silva",
    fornecedor: "Grupo Fiori",
    admin: "Administrador"
  };

  document.querySelector(".account-name").textContent = accountName[role];
}

function logout() {
  document.getElementById("appView").classList.remove("active");
  document.getElementById("loginPage").style.display = "grid";
  document.getElementById("cartDrawer").classList.remove("open");
  document.getElementById("cartBackdrop").classList.remove("open");
  document.getElementById("settingsModal").classList.remove("open");
}

function bindEvents() {
  document.querySelectorAll(".role-btn").forEach((btn) => {
    btn.addEventListener("click", () => setActiveRole(btn.dataset.role));
  });

  document.getElementById("loginBtn").addEventListener("click", login);
  document.getElementById("logoutBtn").addEventListener("click", logout);

  document.querySelector(".password-toggle").addEventListener("click", () => {
    const input = document.getElementById("passwordInput");
    input.type = input.type === "password" ? "text" : "password";
  });

  document.querySelectorAll(".demo-access").forEach((btn) => {
    btn.addEventListener("click", () => {
      const demo = btn.dataset.demo;
      setActiveRole(demo);
      if (demo === "cliente") {
        document.getElementById("emailInput").value = "cliente@vitrinepro.com";
      }
      if (demo === "fornecedor") {
        document.getElementById("emailInput").value = "fornecedor@grupofiori.com";
      }
      if (demo === "admin") {
        document.getElementById("emailInput").value = "admin@vitrinepro.com";
      }
      document.getElementById("passwordInput").value = "123456";
      login();
    });
  });

  document.getElementById("searchInput").addEventListener("input", (e) => {
    state.search = e.target.value.trim();
    renderProducts();
  });

  document.getElementById("filterToggle").addEventListener("click", () => {
    document.getElementById("filterPanel").classList.toggle("open");
  });

  document.querySelectorAll(".filter-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".filter-chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      state.filter = chip.dataset.filter;
      renderProducts();
    });
  });

  document.querySelectorAll(".nav-link").forEach((btn) => {
    btn.addEventListener("click", () => openPanel(btn.dataset.panel));
  });

  document.getElementById("openCartBtn").addEventListener("click", () => {
    document.getElementById("cartDrawer").classList.add("open");
    document.getElementById("cartBackdrop").classList.add("open");
  });

  document.getElementById("closeCartBtn").addEventListener("click", () => {
    document.getElementById("cartDrawer").classList.remove("open");
    document.getElementById("cartBackdrop").classList.remove("open");
  });

  document.getElementById("cartBackdrop").addEventListener("click", () => {
    document.getElementById("cartDrawer").classList.remove("open");
    document.getElementById("cartBackdrop").classList.remove("open");
  });

  document.getElementById("simulateBtn").addEventListener("click", () => {
    const total = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const result = document.getElementById("simulationResult");
    result.innerHTML = `Pedido simulado com sucesso.<br>Itens: ${state.cart.length} · Valor total: ${formatCurrency(total)}<br>Prazo estimado: 48h para entrega.`;
    result.classList.add("show");
  });

  document.getElementById("settingsBtn").addEventListener("click", () => {
    document.getElementById("settingsModal").classList.add("open");
  });

  document.getElementById("closeSettingsBtn").addEventListener("click", () => {
    document.getElementById("settingsModal").classList.remove("open");
  });

  document.querySelectorAll(".settings-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".settings-tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      const target = tab.dataset.settingsTab;
      document.querySelectorAll(".settings-panel").forEach((panel) => {
        panel.classList.toggle("active", panel.dataset.settingsPanel === target);
      });
    });
  });

  document.querySelectorAll(".favorites-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      state.favoriteTab = tab.dataset.favorTab;
      document.querySelectorAll(".favorites-tab").forEach((t) => t.classList.toggle("active", t === tab));
      renderFavorites();
    });
  });

  document.querySelectorAll(".admin-menu button").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".admin-menu button").forEach((b) => b.classList.remove("active"));
      tab.classList.add("active");
      document.querySelectorAll(".admin-panel").forEach((panel) => {
        panel.classList.toggle("active", panel.dataset.panelId === tab.dataset.adminTab);
      });
    });
  });

  document.addEventListener("click", (event) => {
    const productId = event.target.dataset.productId;
    if (productId) {
      addToCart(Number(productId));
    }

    const removeProductId = event.target.dataset.cartRemove;
    if (removeProductId) {
      changeCartQuantity(Number(removeProductId), -999);
    }

    const minusId = event.target.dataset.cartMinus;
    if (minusId) {
      changeCartQuantity(Number(minusId), -1);
    }

    const plusId = event.target.dataset.cartPlus;
    if (plusId) {
      changeCartQuantity(Number(plusId), 1);
    }

    const favoriteProduct = event.target.dataset.favoriteProduct;
    if (favoriteProduct) {
      toggleFavorite(Number(favoriteProduct));
    }

    const favoriteSupplier = event.target.dataset.favoriteSupplier;
    if (favoriteSupplier) {
      toggleFavoriteSupplier(Number(favoriteSupplier));
    }

    const openSupplier = event.target.dataset.openSupplier;
    if (openSupplier) {
      state.selectedSupplier = Number(openSupplier);
      renderSupplierDetail();
    }

    if (event.target.id === "backToSuppliers") {
      const detail = document.getElementById("supplierDetailView");
      if (detail) detail.remove();
      state.selectedSupplier = null;
    }
  });

  document.addEventListener("click", (event) => {
    const card = event.target.closest(".supplier-directory-card");
    if (card && !event.target.closest("button")) {
      const supplierId = card.dataset.supplierId;
      state.selectedSupplier = Number(supplierId);
      renderSupplierDetail();
    }
  });
}

function init() {
  bindEvents();
  setActiveRole("cliente");
  renderProducts();
  renderSuppliers();
  renderFavorites();
  renderAdminLogs();
  updateCart();
}

init();
