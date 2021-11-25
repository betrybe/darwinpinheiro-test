var cart = []

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
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
  document.getElementsByClassName("cart__items")[0].appendChild(element);
}



function insertStorage(item) {
  cart.push(item)
  // const index = Object.keys(localStorage).length+1;
  localStorage.setItem("cart",  JSON.stringify(cart))
}

function loadProduct(id) {
  const url = `https://api.mercadolibre.com/items/${id}`
  const request = new XMLHttpRequest();
  request.onload = () => {
    var response = JSON.parse(request.responseText);
    insertProductIntoCart(response);
    insertStorage(response);
  }
  request.open("GET", url);
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

function cartItemClickListener(event) {
  const target = document.getElementsByClassName("cart__items")[0]
  target.removeChild(this)
  removeStorage(this.innerText);
}

function removeStorage(text){
  
  let target = JSON.parse(localStorage.cart);
  for (item of target){
    if (text.substr(5,13) == item.id){
      target.splice(target.indexOf(item), 1);
      cart=target;
      localStorage.setItem("cart", JSON.stringify(cart))
      break;
    }
  }
 
}




function insertResultIntoDOM(item) {
  const product = { sku: item.id, name: item.title, image: item.thumbnail };
  const element = createProductItemElement(product);
  document.getElementsByClassName("items")[0].appendChild(element);
}

function loadResultAPI() {
  const url = "https://api.mercadolibre.com/sites/MLB/search?q=computador"
  const request = new XMLHttpRequest();
  request.onerror = (e) => alert("API OFFLINE");
  request.onload = () => {
    var response = JSON.parse(request.responseText);
    if (response.erro === true) alert("Dados não encontrados");
    else {
      for (const item of response.results) insertResultIntoDOM(item);
    }
  }
  request.open("GET", url);
  request.send();
}

function loadCart() {
  if (localStorage.cart != null){
    cart = JSON.parse(localStorage.cart)
    for (item of cart){
      insertProductIntoCart(item);
    }
    
  }
}

window.onload = () => {

  loadCart();
  loadResultAPI();



};
