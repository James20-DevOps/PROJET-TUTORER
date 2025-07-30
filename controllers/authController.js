// controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Etudiant = require('../models/Student');
const Entreprise = require('../models/Company');
const Etablissement = require('../models/Institution');

// Inscription
exports.signup = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    // Vérifier si l'utilisateur existe déjà
    const existant = await User.findOne({ email });
    if (existant) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé.' });
    }

    let model;
    switch (role) {
      case 'etudiant':
        model = Etudiant;
        break;
      case 'entreprise':
        model = Entreprise;
        break;
      case 'etablissement':
        model = Etablissement;
        break;
      case 'admin':
        model = User;
        break;
      default:
        return res.status(400).json({ error: 'Rôle invalide.' });
    }

    // Créer l'utilisateur de base
    const user = new model({ email, password, role, ...req.body });
    await user.save();

    // Générer le token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.status(201).json({
      message: 'Utilisateur créé avec succès.',
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        ...(role === 'etudiant' && { nom: user.nom, prenom: user.prenom }),
        ...(role === 'entreprise' && { nom: user.nom }),
        ...(role === 'etablissement' && { nom: user.nom })
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Connexion
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).populate('role');
    if (!user) {
      return res.status(400).json({ error: 'Identifiants incorrects.' });
    }

    const isValid = await user.comparePassword(password);
    if (!isValid) {
      return res.status(400).json({ error: 'Identifiants incorrects.' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({
      message: 'Connexion réussie.',
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};