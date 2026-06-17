const pool = require('../db');

const createOrder = async (req, res) => {
  try {
    const { items } = req.body;
    const user_id = req.user.id;
    let total = 0;

    for (const item of items) {
      const [products] = await pool.execute(
        'SELECT price FROM products WHERE id = ?', [item.product_id]
      );
      if (products.length > 0) {
        total += products[0].price * item.quantity;
      }
    }

    const [order] = await pool.execute(
      'INSERT INTO orders (user_id, total, status) VALUES (?, ?, ?)',
      [user_id, total, 'pending']
    );

    for (const item of items) {
      const [products] = await pool.execute(
        'SELECT price FROM products WHERE id = ?', [item.product_id]
      );
      if (products.length > 0) {
        await pool.execute(
          'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
          [order.insertId, item.product_id, item.quantity, products[0].price]
        );
      }
    }

    res.json({ order_id: order.insertId, total, status: 'pending' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const [orders] = await pool.execute(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const [orders] = await pool.execute(
      'SELECT * FROM orders ORDER BY created_at DESC'
    );
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createOrder, getMyOrders, getAllOrders };