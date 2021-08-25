// https://github.com/tryber/sd-014-b-project-shopping-cart
// https://github.com/tryber/sd-014-b-project-shopping-cart/pull/19
const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=';

const fetchProducts = async (product) => {
  const data = await fetch(`${API_URL}${product}`)
    .then((result) => result.json());
  return data;
};

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// capturando o valor de cada item no storage/cart:

const sumReducer = (acc, cur) => acc + cur;

const updateStoragePrices = () => {
  const priceList = JSON.parse(localStorage.getItem('prices'));
  const totalPrice = priceList.reduce(sumReducer, 0);
  const totalPriceDiv = document.getElementById('total-cart-price');
  totalPriceDiv.innerHTML = totalPrice;
};

const addPriceToStorage = (productPrice) => {
  const priceList = JSON.parse(localStorage.getItem('prices'));
  priceList.push(productPrice);
  localStorage.setItem('prices', JSON.stringify(priceList));
  updateStoragePrices();
};

const removePriceFromStorageByIndex = (index) => {
  const priceList = JSON.parse(localStorage.getItem('prices'));
  priceList.splice(index, 1);
  localStorage.setItem('prices', JSON.stringify(priceList));
  updateStoragePrices();
};

//
// cart elements:

function cartItemClickListener(event) { // obrigatória
  const itemToBeRemoved = event.target;
  itemToBeRemoved.remove();
  const allCartItems = document.querySelector('.cart__items');
  localStorage.setItem('products', allCartItems.innerHTML);
  /* const itemTextToBeRemoved = itemToBeRemoved.innerText; */
  const productList = JSON.parse(localStorage.getItem('products'));
  removePriceFromStorageByIndex(productList.indexOf(itemToBeRemoved));
  const newList = productList.filter((item) => item !== itemTextToBeRemoved);
  localStorage.setItem('products', JSON.stringify(newList));
}

function cartItemClickListener2(event) {
  const itemToBeRemoved = event.target;
  const allLisOfItems = document.getElementsByTagName('li');
  removePriceFromStorageByIndex(allLisOfItems.indexOf(itemToBeRemoved));
}

const updateStorageItems = () => {
  const allLisOfItems = document.getElementsByTagName('li');
  let storageList = JSON.parse(localStorage.getItem('products'));
  storageList = [];
  allLisOfItems.forEach((item) => addToLocalStorage(item.innerText));
};

function cartItemClickListener3(event) {
  const itemToBeRemoved = event.target;
  itemToBeRemoved.remove();
  const productList = JSON.parse(localStorage.getItem('products'));
  removePriceFromStorageByIndex(productList.indexOf(itemToBeRemoved));
  updateStorageItems();
}

//
//
//

function createCartItemElement({ sku, name, salePrice }) { // obrigatória
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addToLocalStorage = (product) => {
  const productList = JSON.parse(localStorage.getItem('products'));
  productList.push(product);
  localStorage.setItem('products', JSON.stringify(productList));
};

const addItemToCart = (productJson) => {
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

async function getSkuFromProductItem(item) {
  const parent = item.target.parentElement;
  const productId = parent.querySelector('span.item__sku').innerText;
  const data = await fetch(`https://api.mercadolibre.com/items/${productId}`)
    .then((api) => api.json());
  addItemToCart(data);
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) { // obrigatória
  const section = document.createElement('section');
  section.className = 'item';
  
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', getSkuFromProductItem);
  
  return section;
}

//
//

const importFromApiToShop = (resultSearch) => {
  const productItemElement = createProductItemElement({
    sku: resultSearch.id,
    name: resultSearch.title,
    image: resultSearch.thumbnail,
  });
  const sectionItens = document.querySelector('.items');
  sectionItens.appendChild(productItemElement);
};

function createCartItemFromStorage(productSpecs) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = productSpecs;
  li.addEventListener('click', cartItemClickListener);
  const cartItems = document.getElementsByTagName('ol')[0];
  cartItems.appendChild(li);
}

const cartRender = () => {
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
    updateStoragePrices();
  }
};

window.onload = () => {
  fetchProducts('computador')
    .then((products) => products.results.forEach((element) => importFromApiToShop(element)));
  cartRender();
  renderPrices();
};
