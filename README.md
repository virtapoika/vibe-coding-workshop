# Inventory Management System

A modern web application for managing retail store inventory. Built with Node.js, Express, SQLite, and vanilla JavaScript.

## Features

- 📦 **Browse Products**: View all products in a beautiful card-based grid layout
- ➕ **Add Products**: Create new products with details like name, SKU, category, price, and quantity
- ✏️ **Edit Products**: Update existing product information
- 🗑️ **Delete Products**: Remove products from inventory
- 🔢 **Quantity Management**: Quick +/- buttons to adjust product quantities
- 🔍 **Search**: Search products by name, description, or SKU
- 🏷️ **Filter by Category**: Filter products by category (Electronics, Accessories, Furniture, Stationery, Office)
- 📊 **Statistics Dashboard**: View total products, inventory value, and low stock items

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd vibe-coding-workshop
```

2. Install dependencies:
```bash
npm install
```

3. Initialize the database with sample products:
```bash
npm run init-db
```

## Usage

1. Start the server:
```bash
npm start
```

2. Open your browser and navigate to:
```
http://localhost:3000
```

## Project Structure

```
vibe-coding-workshop/
├── public/
│   ├── index.html       # Main HTML file
│   ├── styles.css       # CSS styling
│   └── app.js           # Frontend JavaScript
├── server.js            # Express server and API endpoints
├── init-db.js           # Database initialization script
├── package.json         # Node.js dependencies and scripts
└── README.md           # Documentation
```

## API Endpoints

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get a single product
- `POST /api/products` - Create a new product
- `PUT /api/products/:id` - Update a product
- `DELETE /api/products/:id` - Delete a product

## Technologies Used

- **Backend**: Node.js, Express
- **Database**: SQLite3
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Styling**: Modern CSS with CSS Grid and Flexbox

## Pre-populated Data

The application comes with 20 sample products across different categories:
- Electronics (Mouse, Keyboard, Cables, Webcam, Headphones)
- Accessories (Laptop Stand, Phone Stand, Water Bottle, Desk Organizer, Monitor Stand)
- Furniture (Office Chair, Desk Lamp, Filing Cabinet)
- Stationery (Notebooks, Pens, Sticky Notes, Desk Calendar)
- Office (Whiteboard, Paper Shredder, Calculator)

## Features Walkthrough

### Adding a Product
1. Click the "+ Add New Product" button
2. Fill in the product details (required fields marked with *)
3. Click "Save Product"

### Editing a Product
1. Click the "Edit" button on any product card
2. Update the product information
3. Click "Save Product"

### Deleting a Product
1. Click the "Delete" button on any product card
2. Confirm the deletion

### Adjusting Quantity
Use the +/- buttons on each product card to quickly adjust inventory quantities

### Searching and Filtering
- Use the search box to find products by name, description, or SKU
- Use the category dropdown to filter by product category

## License

ISC