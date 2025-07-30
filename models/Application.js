// models/Application.js
const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  etudiantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Etudiant',
    required: true
  },
  offreId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Offer',
    required: true
  },
  message: {
    type: String
  },
  cvUrl: {
    type: String, // Peut être différent du CV du profil
    required: true
  },
  statut: {
    type: String,
    enum: ['envoyée', 'vue', 'entretien', 'acceptée', 'refusée'],
    default: 'envoyée'
  },
  feedback: {
    type: String
  }
});

module.exports = mongoose.model('Application', applicationSchema);