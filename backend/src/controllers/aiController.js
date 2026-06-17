// aiController.js — Agent IA pour recommandations produits
const { ChatGroq } = require('@langchain/groq');
const { HumanMessage, SystemMessage } = require('@langchain/core/messages');
const pool = require('../db');

// Initialise le LLM Groq une seule fois
const llm = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: 'llama-3.1-8b-instant',
  temperature: 0.7,
});

// POST /api/ai/chat — Chatbot recommandations
const chat = async (req, res) => {
  try {
    const { message, history } = req.body;
    // history = [{ role: 'user'/'assistant', content: '...' }]

    // Récupère les produits disponibles pour le contexte
    const [products] = await pool.execute(
      'SELECT name, description, price, category, stock FROM products WHERE stock > 0'
    );

    const productContext = products.map(p =>
      `- ${p.name} (${p.category}): $${p.price} — ${p.description}`
    ).join('\n');

    // Construit les messages pour l'agent
    const messages = [
      new SystemMessage(`Tu es un assistant pour une boutique de café.
Tu aides les clients à choisir les meilleurs produits.
Réponds toujours en français de manière amicale et professionnelle.

Produits disponibles:
${productContext}

Recommande des produits basés sur les préférences du client.`),

      // Historique de conversation
      ...(history || []).map(msg =>
        msg.role === 'user'
          ? new HumanMessage(msg.content)
          : new SystemMessage(msg.content)
      ),

      // Message actuel
      new HumanMessage(message)
    ];

    const response = await llm.invoke(messages);

    res.json({
      message: response.content,
      role: 'assistant'
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/ai/recommend — Recommandations basées sur commandes
const recommend = async (req, res) => {
  try {
    const user_id = req.user.id;

    // Récupère l'historique d'achats
    const [orders] = await pool.execute(
      `SELECT p.name, p.category, oi.quantity
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       JOIN orders o ON oi.order_id = o.id
       WHERE o.user_id = ?`,
      [user_id]
    );

    // Tous les produits disponibles
    const [products] = await pool.execute(
      'SELECT name, description, price, category FROM products WHERE stock > 0'
    );

    const orderHistory = orders.length > 0
      ? orders.map(o => `${o.name} (x${o.quantity})`).join(', ')
      : 'Aucun achat précédent';

    const productList = products.map(p =>
     ` ${p.name} — $${p.price} (${p.category})`
    ).join('\n');

    const messages = [
      new SystemMessage(`Tu es un expert en recommandations de café.`),
      new HumanMessage(
        `Historique d'achats du client: ${orderHistory}
         
         Produits disponibles:
         ${productList}
         
         Recommande 3 produits personnalisés avec une explication courte.`
      )
    ];

    const response = await llm.invoke(messages);

    res.json({ recommendations: response.content });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { chat, recommend };