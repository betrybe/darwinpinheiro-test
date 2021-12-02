let cart = [];

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function removeStorage(text) {
  const target = JSON.parse(localStorage.cart);
  let isRemoved = false;
  target.forEach((item) => {
    if (text.substr(5, 13) === item.id && isRemoved === false) {
      isRemoved = true;
      target.splice(target.indexOf(item), 1);
      cart = target;
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  });
}

function calcPrices() {
  let sum = 0;
  const total = 'total-price';
  cart.forEach((item) => {
    sum += item.price;
  });
  document.getElementsByClassName(total)[0].innerHTML = sum;
  localStorage.setItem(total, sum);
}

function cartItemClickListener() {
  const target = document.getElementsByClassName('cart__items')[0];
  target.removeChild(this);
  removeStorage(this.innerText);
  calcPrices();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function insertProductIntoCart(item) {
  const product = { sku: item.id, name: item.title, salePrice: item.price };
  const element = createCartItemElement(product);
  document.getElementsByClassName('cart__items')[0].appendChild(element);
}

function insertStorage(item) {
  cart.push(item);
  localStorage.setItem('cart', JSON.stringify(cart));
}

async function loadProduct(id) {
  const response = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const result = await response.json();
  insertProductIntoCart(result);
  insertStorage(result);
  calcPrices();
}

function createCustomElement(element, className, innerText, sku) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (element === 'button') {
    e.onclick = () => loadProduct(sku);
  }
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!', sku));
  return section;
}

function insertResultIntoDOM(item) {
  const product = { sku: item.id, name: item.title, image: item.thumbnail };
  const element = createProductItemElement(product);
  document.getElementsByClassName('items')[0].appendChild(element);
}

function iteratorResult(results) {
  results.forEach((item) => {
    insertResultIntoDOM(item);
  });
}

function closeLoading() {
  document.getElementsByClassName('items')[0].style.display = 'flex';
  const parentLoading = document.getElementsByClassName('alert')[0];
  parentLoading.removeChild(parentLoading.childNodes[0]);
}

async function loadResultAPI() {
  const query = 'computador';
  const url = `https://api.mercadolibre.com/sites/MLB/search?q=${query}`;
  const response = await fetch(url);
  const result = response.json();
  closeLoading();
  return result;
}

function loadCartFromStorage() {
  cart = JSON.parse(localStorage.cart);
  cart.forEach((item) => {
    insertProductIntoCart(item);
  });
}

function loadCart() {
  if (localStorage.cart != null) {
    loadCartFromStorage();
  } else {
    document.getElementsByClassName('total-price')[0].innerHTML = 0;
    const e = document.getElementsByClassName('cart__items')[0];
    let child = e.lastElementChild;
    while (child) {
      e.removeChild(child);
      child = e.lastElementChild;
    }
  }
}

function loadTrash() {
  document.getElementsByClassName('empty-cart')[0].addEventListener('click', function () {
    localStorage.clear();
    loadCart();
  });
}

window.onload = async () => {
  loadCart();
  const itens = await loadResultAPI();
  iteratorResult(itens.results);
  loadTrash();
};