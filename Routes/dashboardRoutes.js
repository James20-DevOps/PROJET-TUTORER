const express = require('express');
const router = express.Router();

const dashboardController = require('../controllers/dashboardController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// 🔐 Dashboard (tous les rôles)
router.get('/', auth, role('etudiant', 'entreprise', 'etablissement', 'admin'), dashboardController.getDashboard);

module.exports = router;
