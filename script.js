const BASE_URL = 'https://api.mercadolibre.com/sites/MLB';

const fetchProducts = async (product) => {
  const data = await fetch(`${BASE_URL}/search?q=${product}`);
  const products = await data.json();
  return products;
};

const sumReducer = (acc, cur) => acc + cur;

const updateStoragePrices = () => { // Add sum from storage 'prices' into <span>:
  const priceList = JSON.parse(localStorage.getItem('prices'));
  const totalPrice = priceList.reduce(sumReducer, 0);
  const totalPriceSpan = document.querySelector('.total-price');
  totalPriceSpan.innerHTML = totalPrice;
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

const updateStorageItems = () => { // Import shopcart into storage 'products'
  const allCartItems = document.querySelectorAll('li');
  localStorage.setItem('products', JSON.stringify([])); // reset 'products'
  const productList = [];
  for (let index = 0; index < allCartItems.length; index += 1) {
    productList.push(allCartItems[index].innerText);
  }
  localStorage.setItem('products', JSON.stringify(productList));
};

function cartItemClickListener(event) { // listener: removes element from shopcart and its price from storage
  const allCartItems = document.querySelectorAll('li');
  for (let index = 0; index < allCartItems.length; index += 1) {
    if (allCartItems[index] === event.target) {
      removePriceFromStorageByIndex(index);
    }
  }
  event.target.remove();
  updateStorageItems();
}

const addItemToStorage = (newItem) => { // Add item from shopcart into storage
  const productList = JSON.parse(localStorage.getItem('products'));
  productList.push(newItem);
  localStorage.setItem('products', JSON.stringify(productList));
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addItemToCart = (productJson) => {
  const productInfo = createCartItemElement({
    sku: productJson.id,
    name: productJson.title,
    salePrice: productJson.price,
  });
  const cartItems = document.querySelector('.cart__items');
  cartItems.appendChild(productInfo);
  if (localStorage.getItem('products') === null) {
    localStorage.setItem('products', JSON.stringify([]));
  }
  if (localStorage.getItem('prices') === null) {
    localStorage.setItem('prices', JSON.stringify([]));
  }
  addItemToStorage(productInfo.innerHTML);
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

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', getSkuFromProductItem);

  return section;
}

const importProductFromApiToSection = (resultSearch) => {
  const productItemElement = createProductItemElement({
    sku: resultSearch.id,
    name: resultSearch.title,
    image: resultSearch.thumbnail,
  });
  const cartList = document.querySelector('.items');
  cartList.appendChild(productItemElement);
};

const createCartItemFromStorage = (productSpecs) => { // Add item from storage into shopcart
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = productSpecs;
  li.addEventListener('click', cartItemClickListener);
  const cartItems = document.querySelector('.cart__items');
  cartItems.appendChild(li);
};

const cartRender = () => { // Initial storage rendering
  if (localStorage.getItem('products') === null) {
    localStorage.setItem('products', JSON.stringify([]));
  } else {
    const productList = JSON.parse(localStorage.getItem('products'));
    productList.forEach((item) => createCartItemFromStorage(item));
  }
};

const renderPrices = () => { // Initial storage rendering
  if (localStorage.getItem('prices') === null) {
    localStorage.setItem('prices', JSON.stringify([]));
  } else {
    updateStoragePrices();
  }
};

const emptyCart = () => { // Empty cart button feature
  const allCartItems = document.querySelector('ol');
  allCartItems.innerHTML = '';
  localStorage.setItem('prices', JSON.stringify([])); 
  updateStorageItems();
  updateStoragePrices();
};

const emptyCartButton = document.querySelector('.empty-cart');
emptyCartButton.addEventListener('click', emptyCart);

window.onload = () => {
  fetchProducts('computador')
    .then((dataJson) => {
      dataJson.results.forEach((result) => importProductFromApiToSection(result));
    })
    .then(() => document.querySelector('.loading').remove());
  cartRender();
  renderPrices();
};
