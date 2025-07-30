// models/Company.js
const mongoose = require('mongoose');
const User = require('./User');

const companySchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true
  },
  secteur: {
    type: String,
    required: true
  },
  adresse: {
    type: String
  },
  siteWeb: {
    type: String
  },
  contact: {
    nom: String,
    poste: String,
    email: String,
    telephone: String
  },
  estValidee: {
    type: Boolean,
    default: false // Doit être validée par un établissement ou admin
  }
});

module.exports = User.discriminator('Entreprise', companySchema);