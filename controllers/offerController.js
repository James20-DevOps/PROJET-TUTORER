// controllers/offerController.js
const Offer = require('../models/Offer');

// Créer une offre (réservé entreprise)
exports.createOffer = async (req, res) => {
  try {
    const { titre, description, domaine, localisation, duree, type, dateDebut } = req.body;

    const offre = new Offer({
      titre,
      description,
      domaine,
      localisation,
      duree,
      type,
      dateDebut,
      entrepriseId: req.user.id,
      statut: 'en attente' // En attente de validation par l'établissement
    });

    await offre.save();
    res.status(201).json({
      message: 'Offre créée avec succès. En attente de validation.',
      offre
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lire toutes les offres validées (publiques)
exports.getAllOffers = async (req, res) => {
  try {
    const { domaine, localisation, type } = req.query;

    const filter = { statut: 'ouverte' }; // Seulement les offres validées et ouvertes

    if (domaine) filter.domaine = domaine;
    if (localisation) filter.localisation = new RegExp(localisation, 'i');
    if (type) filter.type = type;

    const offres = await Offer.find(filter)
      .populate('entrepriseId', 'nom secteur')
      .sort({ createdAt: -1 });

    res.json(offres);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Voir une offre spécifique
exports.getOfferById = async (req, res) => {
  try {
    const offre = await Offer.findById(req.params.id)
      .populate('entrepriseId', 'nom secteur contact')
      .populate('valideePar', 'nom');

    if (!offre) return res.status(404).json({ error: 'Offre non trouvée.' });

    res.json(offre);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Valider une offre (réservé établissement)
exports.validateOffer = async (req, res) => {
  try {
    const offre = await Offer.findById(req.params.id);

    if (!offre) return res.status(404).json({ error: 'Offre non trouvée.' });
    if (offre.statut !== 'en attente') {
      return res.status(400).json({ error: 'Cette offre n’est pas en attente de validation.' });
    }

    offre.statut = 'ouverte';
    offre.valideePar = req.user.id;
    await offre.save();

    res.json({
      message: 'Offre validée et publiée avec succès.',
      offre
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Fermer une offre
exports.closeOffer = async (req, res) => {
  try {
    const offre = await Offer.findById(req.params.id);

    if (!offre) return res.status(404).json({ error: 'Offre non trouvée.' });
    if (offre.entrepriseId.toString() !== req.user.id && req.user.role !== 'etablissement') {
      return res.status(403).json({ error: 'Accès refusé.' });
    }

    offre.statut = 'fermée';
    await offre.save();

    res.json({ message: 'Offre fermée avec succès.', offre });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};