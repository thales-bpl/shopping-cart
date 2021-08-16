// https://github.com/tryber/sd-014-b-project-shopping-cart
const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=';

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function cartItemClickListener(event) {
  
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', skuCatcher);
  
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

//
//
/* const cartItems2 = document.getElementsByClassName('cart__items');
console.log(cartItems2); */
/*   const cartItems1 = document.querySelector('#cart__items'); */
/*   console.log(cartItems1); */

const addToCart = (productJson) => {
  const productInfo = createCartItemElement({
    sku: productJson.id,
    name: productJson.title,
    salePrice: productJson.price,
  });
  const cartItems = document.getElementsByTagName('ol')[0];
  cartItems.appendChild(productInfo);
};

const skuCatcher = async (event) => {
  const parent = event.target.parentElement;
  const productId = getSkuFromProductItem(parent);
  const data = await fetch(`https://api.mercadolibre.com/items/${productId}`)
    .then((api) => api.json());
  addToCart(data);
};

/* ERROR: Uncaught (in promise) TypeError:
    cartItems.appendChild is not a function
    at addToCart (script.js:59)
    at HTMLButtonElement.skuCatcher (script.js:67) */

const addMapProduct = (resultSearch) => {
  const productItemElement = createProductItemElement({
    sku: resultSearch.id,
    name: resultSearch.title,
    image: resultSearch.thumbnail,
  });
  const sectionItens = document.querySelector('.items');
  sectionItens.appendChild(productItemElement);
};

const fetchProducts = async (product) => {
  const data = await fetch(`${API_URL}${product}`);
  const products = await data.json();
  return products;
};

window.onload = () => {
  fetchProducts('computador')
  .then((products) => products.results.forEach((element) => addMapProduct(element)));
};
