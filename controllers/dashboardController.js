// controllers/dashboardController.js
const Offer = require('../models/Offer');
const Application = require('../models/Application');
const Stage = require('../models/Stage');
const User = require('../models/User');

exports.getDashboard = async (req, res) => {
  try {
    let data = {};

    switch (req.user.role) {
      case 'etudiant':
        const student = await User.findOne({ _id: req.user.id }).populate('etudiant');
        const applications = await Application.find({ etudiantId: student._id });
        const stages = await Stage.find({ 'candidatureId.etudiantId': student._id });

        data = {
          profile: student,
          stats: {
            totalApplications: applications.length,
            accepted: applications.filter(a => a.statut === 'acceptée').length,
            stagesCount: stages.length
          },
          recentApplications: applications.slice(0, 5)
        };
        break;

      case 'entreprise':
        const offers = await Offer.find({ entrepriseId: req.user.id });
        const applicationsCount = await Application.countDocuments({ offreId: { $in: offers.map(o => o._id) } });

        data = {
          stats: {
            totalOffers: offers.length,
            activeOffers: offers.filter(o => o.statut === 'ouverte').length,
            applicationsReceived: applicationsCount,
            stagesCount: await Stage.countDocuments({ 'candidatureId.offreId': { $in: offers.map(o => o._id) } })
          },
          recentOffers: offers.slice(0, 5)
        };
        break;

      case 'etablissement':
        const allOffers = await Offer.find({ valideePar: req.user.id });
        const allStages = await Stage.find().populate('candidatureId');

        data = {
          stats: {
            validatedOffers: allOffers.length,
            totalStages: allStages.length,
            studentsOnStage: new Set(allStages.map(s => s.candidatureId.etudiantId)).size,
            partnerCompanies: new Set(allStages.map(s => s.candidatureId.offreId.entrepriseId)).size
          }
        };
        break;

      case 'admin':
        data = {
          stats: {
            totalUsers: await User.countDocuments(),
            totalOffers: await Offer.countDocuments(),
            totalStages: await Stage.countDocuments(),
            pendingOffers: await Offer.countDocuments({ statut: 'en attente' })
          }
        };
        break;

      default:
        return res.status(400).json({ error: 'Rôle inconnu.' });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};