// routes/evaluationRoutes.js
const express = require('express');
const router = express.Router();

const evaluationController = require('../controllers/evaluationController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// 🔐 Évaluer un stage (entreprise ou établissement)
router.post('/', auth, role('entreprise', 'etablissement'), evaluationController.createEvaluation);

// 🔍 Voir les évaluations d’un stage
router.get('/stage/:stageId', auth, evaluationController.getEvaluationsForStage);

module.exports = router;