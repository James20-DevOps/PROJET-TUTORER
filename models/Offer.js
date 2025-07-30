// models/Offer.js
const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  domaine: {
    type: String,
    required: true,
    enum: ['informatique', 'marketing', 'finance', 'gestion', 'design', 'autre']
  },
  localisation: {
    type: String
  },
  duree: {
    type: String // ex: "3 mois", "6 mois"
  },
  type: {
    type: String,
    enum: ['stage', 'emploi'],
    default: 'stage'
  },
  dateDebut: {
    type: Date
  },
  entrepriseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Entreprise',
    required: true
  },
  statut: {
    type: String,
    enum: ['ouverte', 'fermée', 'en attente'],
    default: 'en attente'
  },
  valideePar: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Institution'
  },
  dateValidite: {
    type: Date,
    expires: '30d' // Optionnel : auto-suppression après 30 jours
  }
});

module.exports = mongoose.model('Offer', offerSchema);