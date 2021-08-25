const BASE_URL = 'https://api.mercadolibre.com/sites/MLB';

const fetchProducts = async () => {
  const data = await fetch(`${BASE_URL}/search?q=computador`);
  const products = await data.json();
  return products;
};

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

const addItemToStorage = (newItem) => {
  const productList = JSON.parse(localStorage.getItem('products'));
  productList.push(newItem);
  localStorage.setItem('products', JSON.stringify(productList));
};

//
function cartItemClickListener(event) {
  event.target.remove();
  // add update Storage
}

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
  addItemToStorage(productInfo.innerHTML);
};

async function getSkuFromProductItem(item) {
  const parent = item.target.parentElement;
  const productId = parent.querySelector('span.item__sku').innerText;
  const data = await fetch(`https://api.mercadolibre.com/items/${productId}`)
    .then((api) => api.json());
  addItemToCart(data);
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

const addProductToSection = (resultSearch) => {
  const productItemElement = createProductItemElement({
    sku: resultSearch.id,
    name: resultSearch.title,
    image: resultSearch.thumbnail,
  });
  const cartList = document.querySelector('.items');
  cartList.appendChild(productItemElement);
};

//

const createCartItemFromStorage = (productSpecs) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = productSpecs;
  li.addEventListener('click', cartItemClickListener);
  const cartItems = document.querySelector('.cart__items');
  cartItems.appendChild(li);
};

const cartRender = () => {
  if (localStorage.getItem('products') === null) {
    localStorage.setItem('products', JSON.stringify([]));
  } else {
    const productList = JSON.parse(localStorage.getItem('products'));
    productList.forEach((item) => createCartItemFromStorage(item));
  }
};

window.onload = () => {
  fetchProducts()
    .then((dataJson) => {
      dataJson.results.forEach((result) => addProductToSection(result));
    });
  cartRender();
};
