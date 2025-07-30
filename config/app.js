const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

// Middlewares de sécurité
app.use(helmet());
app.use(cors());

// Parsing JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route de test
app.get('/', (req, res) => {
  res.json({ message: 'API Stages Platform', status: 'OK' });
});

// Gestion erreurs 404
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

module.exports = app;