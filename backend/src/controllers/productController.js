// productController.js — Gère les produits
// GET tous les produits, GET un produit, POST créer, PUT modifier, DELETE supprimer
const pool = require('../db');

// GET tous les produits
const getProducts = async (req, res) => {
  try {
    const [products] = await pool.execute(
      'SELECT * FROM products ORDER BY id DESC'
    );
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET un produit par ID
const getProduct = async (req, res) => {
  try {
    const [products] = await pool.execute(
      'SELECT * FROM products WHERE id = ?', [req.params.id]
    );
    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(products[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST créer un produit (admin seulement)
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, image_url } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO products (name, description, price, category, stock, image_url) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, price, category, stock, image_url]
    );
    res.status(201).json({ id: result.insertId, message: 'Product created' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT modifier un produit
const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, image_url } = req.body;
    await pool.execute(
      'UPDATE products SET name=?, description=?, price=?, category=?, stock=?, image_url=? WHERE id=?',
      [name, description, price, category, stock, image_url, req.params.id]
    );
    res.json({ message: 'Product updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE supprimer un produit
const deleteProduct = async (req, res) => {
  try {
    await pool.execute('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct };