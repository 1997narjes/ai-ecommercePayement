require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://aiecommerce-aecj2qdtk-narjes.vercel.app',
    /\.vercel\.app$/
  ],
  credentials: true
}));

app.use(express.json());

app.get('/', (req, res) => res.json({ ok: true }));
app.get('/test', (req, res) => res.json({ test: true }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/ai', require('./routes/ai'));

app.listen(process.env.PORT || 3001, () => console.log('Server on port 3001'));