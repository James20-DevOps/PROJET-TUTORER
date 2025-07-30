// models/Institution.js
const mongoose = require('mongoose');
const User = require('./User');

const institutionSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['universite', 'école', 'centre de formation', 'IUT', 'CPGE']
  },
  adresse: {
    type: String
  },
  responsable: {
    nom: String,
    poste: String,
    email: String
  },
  codeAcces: {
    type: String,
    unique: true // Pour l'inscription contrôlée
  }
});

module.exports = User.discriminator('Institution', institutionSchema);