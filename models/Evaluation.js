// models/Evaluation.js
const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema({
  stageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stage',
    required: true
  },
  auteurId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  auteurRole: {
    type: String,
    enum: ['entreprise', 'etablissement'],
    required: true
  },
  note: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  commentaires: {
    type: String,
    maxlength: 1000
  },
  competences: [{
    nom: String,
    niveau: { type: Number, min: 1, max: 5 } // ex: "Travail d'équipe", 4
  }],
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Evaluation', evaluationSchema);