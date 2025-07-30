// models/Student.js
const mongoose = require('mongoose');
const User = require('./User');

// On crée un modèle discriminé à partir de User
const studentSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true
  },
  prenom: {
    type: String,
    required: true
  },
  filiere: {
    type: String,
    required: true
  },
  niveau: {
    type: String,
    required: true
  },
  cvUrl: {
    type: String // Lien vers le CV stocké (ex: Cloudinary, ou /uploads)
  },
  competences: [{
    type: String
  }],
  etablissementId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Institution',
    required: true
  }
});

// On attache ce schéma comme discriminant de User avec le rôle 'etudiant'
module.exports = User.discriminator('Etudiant', studentSchema);