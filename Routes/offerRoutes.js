// routes/offerRoutes.js
const express = require('express');
const router = express.Router();

const offerController = require('../controllers/offerController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// 🔓 Public
router.get('/', offerController.getAllOffers);
router.get('/:id', offerController.getOfferById);

// 🔐 Entreprise : créer et fermer
router.post('/', auth, role('entreprise'), offerController.createOffer);
router.patch('/:id/close', auth, role('entreprise', 'etablissement'), offerController.closeOffer);

// 🔐 Établissement : valider
router.patch('/:id/validate', auth, role('etablissement'), offerController.validateOffer);

module.exports = router;