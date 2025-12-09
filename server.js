const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Database connection
const db = new sqlite3.Database('inventory.db', (err) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

// API Routes

// Get all products
app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products ORDER BY id', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get single product
app.get('/api/products/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json(row);
  });
});

// Create new product
app.post('/api/products', (req, res) => {
  const { name, description, category, price, quantity, sku, image_url } = req.body;
  
  if (!name || !category || price === undefined || quantity === undefined || !sku) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  if (price < 0 || quantity < 0) {
    res.status(400).json({ error: 'Price and quantity must be non-negative' });
    return;
  }

  db.run(
    `INSERT INTO products (name, description, category, price, quantity, sku, image_url) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name, description, category, price, quantity, sku, image_url || '📦'],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({ id: this.lastID, message: 'Product created successfully' });
    }
  );
});

// Update product
app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const { name, description, category, price, quantity, sku, image_url } = req.body;
  
  if (!name || !category || price === undefined || quantity === undefined || !sku) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  if (price < 0 || quantity < 0) {
    res.status(400).json({ error: 'Price and quantity must be non-negative' });
    return;
  }
  
  db.run(
    `UPDATE products 
     SET name = ?, description = ?, category = ?, price = ?, quantity = ?, sku = ?, image_url = ?
     WHERE id = ?`,
    [name, description, category, price, quantity, sku, image_url, id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }
      res.json({ message: 'Product updated successfully' });
    }
  );
});

// Delete product
app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM products WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json({ message: 'Product deleted successfully' });
  });
});

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('Database connection closed');
    }
    process.exit(0);
  });
});
