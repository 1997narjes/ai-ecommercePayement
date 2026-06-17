-- Table users : stocke les comptes clients et admins
CREATE TABLE users (
  id SERIAL PRIMARY KEY,        -- ID auto-incrémenté
  name VARCHAR(100) NOT NULL,   -- Nom complet
  email VARCHAR(100) UNIQUE,    -- Email unique
  password VARCHAR(255),        -- Mot de passe hashé (bcrypt)
  role VARCHAR(20) DEFAULT 'customer', -- 'customer' ou 'admin'
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table products : catalogue des produits
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL, -- Prix avec 2 décimales
  category VARCHAR(100),
  stock INTEGER DEFAULT 0,      -- Quantité disponible
  image_url TEXT
);

-- Table orders : commandes des clients
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id), -- Lié à un user
  total DECIMAL(10,2),
  status VARCHAR(50) DEFAULT 'pending', -- pending/paid/shipped
  stripe_payment_id VARCHAR(255),       -- ID paiement Stripe
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table order_items : produits dans chaque commande
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER,
  price DECIMAL(10,2)  -- Prix au moment de l'achat
);