let cart = [];
let sum = 0;

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function removeStorage(text) {
  let target = JSON.parse(localStorage.cart);
  for (item of target) {
    if (text.substr(5, 13) == item.id) {
      target.splice(target.indexOf(item), 1);
      cart = target;
      localStorage.setItem('cart', JSON.stringify(cart))
      break;
    }
  }
}

function cartItemClickListener(event) {
  const target = document.getElementsByClassName('cart__items')[0]
  target.removeChild(this)
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
  const product = { sku: item.id, name: item.title, salePrice: item.price }
  const element = createCartItemElement(product);
  document.getElementsByClassName('cart__items')[0].appendChild(element);
}

function insertStorage(item) {
  cart.push(item)
  localStorage.setItem('cart', JSON.stringify(cart))
}


function calcPrices() {
  sum = 0;
  for (item of cart) {
    sum = sum + parseFloat(item.price);
    sum.toFixed(2);
  }
  localStorage.setItem('total-price', sum);
  document.getElementsByClassName('total-price')[0].innerHTML = sum;
}

function loadProduct(id) {
  let url = `https://api.mercadolibre.com/items/${id}`
  let request = new XMLHttpRequest();
  request.open('GET', url, false);
  request.onload = () => {
    var response = JSON.parse(request.responseText);
    insertProductIntoCart(response);
    insertStorage(response);
    calcPrices();
  }
  request.send();
}

function createCustomElement(element, className, innerText, sku) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (element == 'button') {
    e.onclick = () => loadProduct(sku)
  }
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!', sku));
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}





function insertResultIntoDOM(item) {
  const product = { sku: item.id, name: item.title, image: item.thumbnail };
  const element = createProductItemElement(product);
  document.getElementsByClassName('items')[0].appendChild(element);
}

function loadResultAPI() {
  document.getElementsByClassName('items')[0].style.display = 'none';
  document.getElementsByClassName('loading')[0].style.display = 'block';
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador'
  const request = new XMLHttpRequest();
  request.onerror = (e) => alert('API OFFLINE');
  request.onload = () => {
    var response = JSON.parse(request.responseText);
    if (response.erro === true) alert('Dados não encontrados');
    else {
      for (const item of response.results) insertResultIntoDOM(item);
    }
  }

  request.onreadystatechange = function () {
    if (request.readyState == 4 && request.status == 200) {
      if (request.responseText) {
        document.getElementsByClassName('items')[0].style.display = 'flex';
        let a = document.getElementsByClassName('alert')[0];
        a.removeChild(a.childNodes[0]);
      }
    }
  };

  request.open('GET', url);
  request.send();
}

function loadCart() {
  if (localStorage.cart != null) {
    cart = JSON.parse(localStorage.cart)
    for (item of cart) {
      insertProductIntoCart(item);
    }
  } else {
    document.getElementsByClassName('total-price')[0].innerHTML = 0
    let e = document.getElementsByClassName('cart__items')[0]
    var child = e.lastElementChild;
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

window.onload = () => {
  loadCart();
  loadResultAPI();
  loadTrash();
};