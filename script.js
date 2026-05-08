const state = {
  cart: [],
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    value
  );

const selectors = {
  navbar: document.querySelector(".navbar"),
  searchForm: document.querySelector(".search-form"),
  searchInput: document.querySelector(".search-form input[type='search']"),
  cartPanel: document.querySelector(".cart-items-container"),
  menuBtn: document.querySelector("#menu-btn"),
  searchBtn: document.querySelector("#search-btn"),
  cartBtn: document.querySelector("#cart-btn"),
  productCards: document.querySelectorAll(".menu .box, .products .box"),
};

const closeOverlays = () => {
  selectors.navbar?.classList.remove("active");
  selectors.searchForm?.classList.remove("active");
  selectors.cartPanel?.classList.remove("active");
};

selectors.menuBtn?.addEventListener("click", () => {
  selectors.navbar?.classList.toggle("active");
  selectors.searchForm?.classList.remove("active");
  selectors.cartPanel?.classList.remove("active");
});

selectors.searchBtn?.addEventListener("click", () => {
  selectors.searchForm?.classList.toggle("active");
  selectors.navbar?.classList.remove("active");
  selectors.cartPanel?.classList.remove("active");
  selectors.searchInput?.focus();
});

selectors.cartBtn?.addEventListener("click", () => {
  selectors.cartPanel?.classList.toggle("active");
  selectors.navbar?.classList.remove("active");
  selectors.searchForm?.classList.remove("active");
});

window.addEventListener("scroll", closeOverlays);

const getProductFromCard = (card) => {
  const name = card.querySelector("h3")?.textContent?.trim() || "Produto";
  const image = card.querySelector("img")?.getAttribute("src") || "";
  const rawPrice = card.querySelector(".price")?.textContent || "0";
  const normalized = rawPrice.replace(/\./g, "").replace(",", ".");
  const match = normalized.match(/\d+(\.\d{1,2})?/);
  const price = Number(match?.[0] || 0);
  return { id: name.toLowerCase(), name, price, image };
};

const addToCart = (product) => {
  const existing = state.cart.find((item) => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    state.cart.push({ ...product, quantity: 1 });
  }
  renderCart();
  selectors.cartPanel?.classList.add("active");
};

const updateQty = (id, delta) => {
  const item = state.cart.find((cartItem) => cartItem.id === id);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) {
    state.cart = state.cart.filter((cartItem) => cartItem.id !== id);
  }
  renderCart();
};

const createCartLayout = () => {
  if (!selectors.cartPanel) return;
  selectors.cartPanel.innerHTML = `
    <div class="cart-list"></div>
    <div class="cart-summary">
      <p class="cart-total">Total: <strong>R$ 0,00</strong></p>
      <a href="#" class="btn cart-quote-btn">Pedir orçamento</a>
    </div>
  `;
};

const renderCart = () => {
  const list = document.querySelector(".cart-list");
  const totalEl = document.querySelector(".cart-total strong");
  if (!list || !totalEl) return;

  if (state.cart.length === 0) {
    list.innerHTML = '<p class="empty-state">Seu carrinho está vazio.</p>';
    totalEl.textContent = formatCurrency(0);
    return;
  }

  list.innerHTML = state.cart
    .map(
      (item) => `
      <div class="cart-item" data-id="${item.id}">
        <img src="${item.image}" alt="${item.name}">
        <div class="content">
          <h3>${item.name}</h3>
          <div class="price">${formatCurrency(item.price)}</div>
          <div class="cart-item-actions">
            <button type="button" class="qty-btn" data-action="decrease">-</button>
            <span>${item.quantity}</span>
            <button type="button" class="qty-btn" data-action="increase">+</button>
            <button type="button" class="remove-btn" data-action="remove">Remover</button>
          </div>
        </div>
      </div>`
    )
    .join("");

  const total = state.cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  totalEl.textContent = formatCurrency(total);
};

const setupCartEvents = () => {
  selectors.cartPanel?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const itemElement = target.closest(".cart-item");
    const id = itemElement?.getAttribute("data-id");
    if (!id) return;

    const action = target.getAttribute("data-action");
    if (action === "increase") updateQty(id, 1);
    if (action === "decrease") updateQty(id, -1);
    if (action === "remove") updateQty(id, -999);
  });

  document.querySelector(".cart-quote-btn")?.addEventListener("click", (event) => {
    event.preventDefault();
    if (state.cart.length === 0) {
      alert("Adicione itens ao carrinho para solicitar orçamento.");
      return;
    }

    const lines = state.cart.map(
      (item) => `• ${item.name} x${item.quantity} (${formatCurrency(item.price * item.quantity)})`
    );
    const total = state.cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const msg = encodeURIComponent(`Olá! Gostaria de solicitar um orçamento:%0A${lines.join("%0A")}%0A%0ATotal: ${formatCurrency(total)}`);
    window.open(`https://api.whatsapp.com/send?phone=5511993212235&text=${msg}`, "_blank");
  });
};

const setupProductActions = () => {
  selectors.productCards.forEach((card) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn add-cart-btn";
    btn.textContent = "Adicionar ao carrinho";
    btn.addEventListener("click", () => addToCart(getProductFromCard(card)));
    card.appendChild(btn);
  });
};

const setupSearch = () => {
  if (!selectors.searchInput) return;

  const emptyResult = document.createElement("p");
  emptyResult.className = "empty-state search-empty-state";
  emptyResult.textContent = "Nenhum produto encontrado.";
  emptyResult.style.display = "none";
  document.querySelector(".menu .box-container")?.after(emptyResult);

  selectors.searchInput.addEventListener("input", (e) => {
    const term = e.target.value.toLowerCase().trim();
    let visibleCount = 0;

    selectors.productCards.forEach((card) => {
      const name = card.querySelector("h3")?.textContent?.toLowerCase() || "";
      const isVisible = !term || name.includes(term);
      card.style.display = isVisible ? "block" : "none";
      if (isVisible) visibleCount += 1;
    });

    emptyResult.style.display = visibleCount === 0 ? "block" : "none";
  });
};

document.addEventListener("DOMContentLoaded", () => {
  createCartLayout();
  renderCart();
  setupCartEvents();
  setupProductActions();
  setupSearch();
});
