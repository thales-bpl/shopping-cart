// https://github.com/tryber/sd-014-b-project-shopping-cart
// https://github.com/tryber/sd-014-b-project-shopping-cart/pull/19
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
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addToLocalStorage = (product) => {
  const oldList = JSON.parse(localStorage.getItem('products'));
  oldList.push(product);
  localStorage.setItem('products', JSON.stringify(oldList));
};

// capturando o valor de cada item no storage/cart:
const sumReducer = (acc, cur) => acc + cur;

const updatePrices = () => {
  const priceList = JSON.parse(localStorage.getItem('prices'));
  const totalPrice = priceList.reduce(sumReducer);
  const totalPriceDiv = document.getElementById('total-cart-price');
  totalPriceDiv.innerHTML = totalPrice;
};

const addPriceToStorage = (productPrice) => {
  const priceList = JSON.parse(localStorage.getItem('prices'));
  priceList.push(productPrice);
  localStorage.setItem('prices', JSON.stringify(priceList));
  updatePrices();
};

const addToCart = (productJson) => {
  const productInfo = createCartItemElement({
    sku: productJson.id,
    name: productJson.title,
    salePrice: productJson.price,
  });
  const cartItems = document.getElementsByTagName('ol')[0];
  cartItems.appendChild(productInfo);
  addToLocalStorage(productInfo.innerHTML);
  addPriceToStorage(productJson.price);
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const skuCatcher = async (event) => {
  const parent = event.target.parentElement;
  const productId = getSkuFromProductItem(parent);
  const data = await fetch(`https://api.mercadolibre.com/items/${productId}`)
    .then((api) => api.json());
  addToCart(data);
};

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

//
//

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

function createCartItemFromStorage(productSpecs) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = productSpecs;
  li.addEventListener('click', cartItemClickListener);
  const cartItems = document.getElementsByTagName('ol')[0];
  cartItems.appendChild(li);
}

const initialCartRender = () => {
  if (localStorage.getItem('products') === null) {
    localStorage.setItem('products', JSON.stringify([]));
  } else {
    const productList = JSON.parse(localStorage.getItem('products'));
    productList.forEach((item) => createCartItemFromStorage(item));
  }
};

const renderPrices = () => {
  if (localStorage.getItem('prices') === null) {
    localStorage.setItem('prices', JSON.stringify([]));
  } else {
    updatePrices();
  }
};

window.onload = () => {
  fetchProducts('computador')
  .then((products) => products.results.forEach((element) => addMapProduct(element)));
  initialCartRender();
  renderPrices();
};
