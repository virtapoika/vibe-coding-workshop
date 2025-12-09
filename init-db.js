const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

// Remove existing database if it exists
if (fs.existsSync('inventory.db')) {
  fs.unlinkSync('inventory.db');
  console.log('Removed existing database');
}

// Create new database
const db = new sqlite3.Database('inventory.db');

db.serialize(() => {
  // Create products table
  db.run(`CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    price REAL NOT NULL,
    quantity INTEGER NOT NULL,
    sku TEXT UNIQUE NOT NULL,
    image_url TEXT
  )`);

  console.log('Created products table');

  // Sample products data - 20 products
  const products = [
    { name: 'Wireless Mouse', description: 'Ergonomic wireless mouse with USB receiver', category: 'Electronics', price: 29.99, quantity: 45, sku: 'ELEC-001', image_url: '🖱️' },
    { name: 'Mechanical Keyboard', description: 'RGB backlit mechanical gaming keyboard', category: 'Electronics', price: 89.99, quantity: 23, sku: 'ELEC-002', image_url: '⌨️' },
    { name: 'USB-C Cable', description: 'Fast charging USB-C cable, 6ft', category: 'Electronics', price: 12.99, quantity: 150, sku: 'ELEC-003', image_url: '🔌' },
    { name: 'Laptop Stand', description: 'Aluminum adjustable laptop stand', category: 'Accessories', price: 39.99, quantity: 35, sku: 'ACC-001', image_url: '💻' },
    { name: 'Desk Lamp', description: 'LED desk lamp with touch control', category: 'Furniture', price: 34.99, quantity: 28, sku: 'FURN-001', image_url: '💡' },
    { name: 'Office Chair', description: 'Ergonomic mesh office chair', category: 'Furniture', price: 199.99, quantity: 12, sku: 'FURN-002', image_url: '🪑' },
    { name: 'Notebook Set', description: 'Set of 3 lined notebooks', category: 'Stationery', price: 15.99, quantity: 67, sku: 'STAT-001', image_url: '📓' },
    { name: 'Pen Set', description: 'Premium gel pen set, 12 colors', category: 'Stationery', price: 18.99, quantity: 89, sku: 'STAT-002', image_url: '🖊️' },
    { name: 'Sticky Notes', description: 'Colorful sticky notes pack', category: 'Stationery', price: 8.99, quantity: 120, sku: 'STAT-003', image_url: '📝' },
    { name: 'Monitor Stand', description: 'Wooden monitor stand with storage', category: 'Accessories', price: 45.99, quantity: 19, sku: 'ACC-002', image_url: '🖥️' },
    { name: 'Webcam HD', description: '1080p HD webcam with microphone', category: 'Electronics', price: 69.99, quantity: 31, sku: 'ELEC-004', image_url: '📷' },
    { name: 'Headphones', description: 'Noise-cancelling wireless headphones', category: 'Electronics', price: 149.99, quantity: 18, sku: 'ELEC-005', image_url: '🎧' },
    { name: 'Phone Stand', description: 'Adjustable phone holder stand', category: 'Accessories', price: 16.99, quantity: 54, sku: 'ACC-003', image_url: '📱' },
    { name: 'Water Bottle', description: 'Insulated stainless steel water bottle', category: 'Accessories', price: 24.99, quantity: 42, sku: 'ACC-004', image_url: '💧' },
    { name: 'Desk Organizer', description: 'Bamboo desk organizer tray', category: 'Accessories', price: 27.99, quantity: 38, sku: 'ACC-005', image_url: '📦' },
    { name: 'Whiteboard', description: 'Magnetic dry erase whiteboard, 24x36', category: 'Office', price: 32.99, quantity: 15, sku: 'OFF-001', image_url: '⬜' },
    { name: 'Filing Cabinet', description: '3-drawer metal filing cabinet', category: 'Furniture', price: 129.99, quantity: 8, sku: 'FURN-003', image_url: '🗄️' },
    { name: 'Paper Shredder', description: 'Cross-cut paper shredder', category: 'Office', price: 59.99, quantity: 14, sku: 'OFF-002', image_url: '📄' },
    { name: 'Calculator', description: 'Scientific calculator', category: 'Office', price: 21.99, quantity: 47, sku: 'OFF-003', image_url: '🔢' },
    { name: 'Desk Calendar', description: '2024 desk calendar planner', category: 'Stationery', price: 13.99, quantity: 62, sku: 'STAT-004', image_url: '📅' }
  ];

  const stmt = db.prepare(`INSERT INTO products (name, description, category, price, quantity, sku, image_url) 
                           VALUES (?, ?, ?, ?, ?, ?, ?)`);

  products.forEach(product => {
    stmt.run(product.name, product.description, product.category, product.price, product.quantity, product.sku, product.image_url);
  });

  stmt.finalize();

  console.log('Inserted 20 sample products');
});

db.close(() => {
  console.log('Database initialized successfully!');
});
