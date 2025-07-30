// routes/stageRoutes.js
const express = require('express');
const router = express.Router();

const stageController = require('../controllers/stageController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const upload = require('../middleware/upload');

// 🔐 Créer un stage (entreprise ou établissement)
router.post('/', auth, role('entreprise', 'etablissement'), stageController.createStage);

// 📎 Upload convention (étudiant ou établissement)
router.post('/:stageId/convention', auth, upload.single('convention'), stageController.uploadConvention);

// 📊 Voir les stages (étudiant ou établissement)
router.get('/mine', auth, role('etudiant', 'etablissement'), stageController.getStudentStages);

module.exports = router;