// API Base URL
const API_URL = '/api/products';

// State
let products = [];
let editingProductId = null;

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const productModal = document.getElementById('productModal');
const productForm = document.getElementById('productForm');
const addProductBtn = document.getElementById('addProductBtn');
const closeModal = document.querySelector('.close');
const cancelBtn = document.getElementById('cancelBtn');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const modalTitle = document.getElementById('modalTitle');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    addProductBtn.addEventListener('click', openAddModal);
    closeModal.addEventListener('click', closeProductModal);
    cancelBtn.addEventListener('click', closeProductModal);
    productForm.addEventListener('submit', handleFormSubmit);
    searchInput.addEventListener('input', filterProducts);
    categoryFilter.addEventListener('change', filterProducts);
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === productModal) {
            closeProductModal();
        }
    });
}

// Load Products from API
async function loadProducts() {
    try {
        productsGrid.innerHTML = '<div class="loading">Loading products...</div>';
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to load products');
        products = await response.json();
        renderProducts(products);
        updateStats();
    } catch (error) {
        console.error('Error loading products:', error);
        productsGrid.innerHTML = '<div class="empty-state">Failed to load products. Please try again.</div>';
    }
}

// Render Products
function renderProducts(productsToRender) {
    if (productsToRender.length === 0) {
        productsGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📦</div>
                <h3>No products found</h3>
                <p>Start by adding your first product!</p>
            </div>
        `;
        return;
    }

    productsGrid.innerHTML = productsToRender.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div class="product-header">
                <div class="product-icon">${product.image_url || '📦'}</div>
                <span class="product-category">${product.category}</span>
            </div>
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description || 'No description available'}</p>
            <p class="product-sku">SKU: ${product.sku}</p>
            
            <div class="product-info">
                <div class="info-item">
                    <div class="info-label">Price</div>
                    <div class="info-value price">$${product.price.toFixed(2)}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">In Stock</div>
                    <div class="info-value quantity ${product.quantity < 20 ? 'low-stock' : ''}">${product.quantity}</div>
                </div>
            </div>
            
            <div class="quantity-controls">
                <button class="quantity-btn" onclick="updateQuantity(${product.id}, -1)" ${product.quantity === 0 ? 'disabled' : ''}>-</button>
                <div class="quantity-display">${product.quantity}</div>
                <button class="quantity-btn" onclick="updateQuantity(${product.id}, 1)">+</button>
            </div>
            
            <div class="product-actions">
                <button class="btn btn-success" onclick="editProduct(${product.id})">Edit</button>
                <button class="btn btn-danger" onclick="deleteProduct(${product.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

// Update Statistics
function updateStats() {
    const totalProducts = products.length;
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    const lowStock = products.filter(p => p.quantity < 20).length;

    document.getElementById('totalProducts').textContent = totalProducts;
    document.getElementById('totalValue').textContent = `$${totalValue.toFixed(2)}`;
    document.getElementById('lowStock').textContent = lowStock;
}

// Filter Products
function filterProducts() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;

    const filtered = products.filter(product => {
        const matchesSearch = 
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.sku.toLowerCase().includes(searchTerm);
        
        const matchesCategory = !selectedCategory || product.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    renderProducts(filtered);
}

// Open Add Modal
function openAddModal() {
    editingProductId = null;
    modalTitle.textContent = 'Add New Product';
    productForm.reset();
    productModal.style.display = 'block';
}

// Open Edit Modal
function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    editingProductId = id;
    modalTitle.textContent = 'Edit Product';
    
    document.getElementById('productName').value = product.name;
    document.getElementById('productSKU').value = product.sku;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productImage').value = product.image_url || '';
    document.getElementById('productDescription').value = product.description || '';
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productQuantity').value = product.quantity;
    
    productModal.style.display = 'block';
}

// Close Modal
function closeProductModal() {
    productModal.style.display = 'none';
    productForm.reset();
    editingProductId = null;
}

// Handle Form Submit
async function handleFormSubmit(e) {
    e.preventDefault();

    const productData = {
        name: document.getElementById('productName').value,
        sku: document.getElementById('productSKU').value,
        category: document.getElementById('productCategory').value,
        image_url: document.getElementById('productImage').value || '📦',
        description: document.getElementById('productDescription').value,
        price: parseFloat(document.getElementById('productPrice').value),
        quantity: parseInt(document.getElementById('productQuantity').value)
    };

    try {
        let response;
        if (editingProductId) {
            // Update existing product
            response = await fetch(`${API_URL}/${editingProductId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });
        } else {
            // Create new product
            response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });
        }

        if (!response.ok) throw new Error('Failed to save product');

        closeProductModal();
        await loadProducts();
    } catch (error) {
        console.error('Error saving product:', error);
        alert('Failed to save product. Please try again.');
    }
}

// Update Quantity
async function updateQuantity(id, change) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const newQuantity = Math.max(0, product.quantity + change);

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...product, quantity: newQuantity })
        });

        if (!response.ok) throw new Error('Failed to update quantity');

        await loadProducts();
    } catch (error) {
        console.error('Error updating quantity:', error);
        alert('Failed to update quantity. Please try again.');
    }
}

// Delete Product
async function deleteProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    if (!confirm(`Are you sure you want to delete "${product.name}"?`)) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete product');

        await loadProducts();
    } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product. Please try again.');
    }
}
