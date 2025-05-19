let products = [];
let orders = [];
let logs = [];

//accessing dom elements
const productForm = document.getElementById('product-form');
const productList = document.getElementById('product-list');
const searchInput = document.getElementById('search-input');
const orderForm = document.getElementById('order-form');
const orderList = document.getElementById('order-list');
const logList = document.getElementById('log-list');

//logging the itmes or products
function logActivity(message) {
    const timestamp = new Date().toLocaleString();
    logs.push(`[${timestamp}] ${message}`);
    updateLogUI();
  }

//update the logs ui  
function updateLogUI() {
    logList.innerHTML = logs.map(log => `<li>${log}</li>`).join('');
}

//rendering the products
function renderProducts(list = products) {
    productList.innerHTML = '';
    list.forEach(product => {
      const li = document.createElement('li');
      li.innerHTML = `
        <strong>${product.name}</strong> (${product.category}) - $${product.price}, Stock: ${product.stock}
        [ID: ${product.id}]
        <button class="edit-btn" data-id="${product.id}">Edit</button>
        <button class="delete-btn" data-id="${product.id}">Delete</button>
      `;
      productList.appendChild(li);
    });
  
    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', () => editProduct(btn.dataset.id));
    });
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', () => deleteProduct(btn.dataset.id));
    });
  }

// function to create or update the product 
function addOrUpdateProduct(e) {
  e.preventDefault();

  const id = document.getElementById('product-id').value || Date.now().toString();
  const name = document.getElementById('product-name').value;
  const category = document.getElementById('product-category').value;
  const price = parseFloat(document.getElementById('product-price').value);
  const stock = parseInt(document.getElementById('product-stock').value);

  const index = products.findIndex(p => p.id === id);
  if (index > -1) {
    products[index] = { id, name, category, price, stock };
    logActivity(`Updated product: ${name}`);
  } else {
    products.push({ id, name, category, price, stock });
    logActivity(`Added product: ${name}`);
  }

  //clear the form inpits after upodation or addition
  productForm.reset();
  renderProducts();
}

//edit function only to refill the form fields so that user can update values here
function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
  
    //fill all the fields with accessing dom elements
    document.getElementById('product-id').value = product.id;
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-category').value = product.category;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-stock').value = product.stock;
  }

  //deleting a particular product function
  function deleteProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
  
    products = products.filter(p => p.id !== id);
    logActivity(`Deleted product: ${product.name}`);
    renderProducts();
  }

//debounce function
  function debounce(func, delay) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this,args), delay);
    };
  }
function debounce(func, delay) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}


//search with deboune logic
const debouncedSearch = debounce(e => {
    const term = e.target.value.toLowerCase();
    const filtered = products.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term)
    );
    renderProducts(filtered);
  }, 300);
  
//event listeners here 
productForm.addEventListener('submit', addOrUpdateProduct);
searchInput.addEventListener('input', debouncedSearch);


