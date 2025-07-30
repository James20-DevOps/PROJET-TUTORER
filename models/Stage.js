// models/Stage.js
const mongoose = require('mongoose');

const stageSchema = new mongoose.Schema({
  candidatureId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true
  },
  dateDebut: {
    type: Date,
    required: true
  },
  dateFin: {
    type: Date,
    required: true
  },
  tuteurEntreprise: {
    nom: String,
    email: String,
    poste: String
  },
  tuteurEtablissement: {
    nom: String,
    email: String,
    poste: String
  },
  statut: {
    type: String,
    enum: ['en cours', 'terminé', 'annulé'],
    default: 'en cours'
  },
  rapportStageUrl: {
    type: String
  },
  conventionUrl: {
    type: String,
    required: true
  }
}, {
  timestamps: true
}, {
    attestationUrl: {
        type: String
    }
}
);

module.exports = mongoose.model('Stage', stageSchema);