// controllers/evaluationController.js
const Evaluation = require('../models/Evaluation');
const Stage = require('../models/Stage');
const User = require('../models/User');

// 📝 Créer une évaluation (entreprise ou établissement)
exports.createEvaluation = async (req, res) => {
  try {
    const { stageId, note, commentaires, competences } = req.body;

    const stage = await Stage.findById(stageId);
    if (!stage) return res.status(404).json({ error: 'Stage non trouvé.' });

    // Vérifier que l'utilisateur a le droit d'évaluer
    const isFromCompany = req.user.role === 'entreprise' && 
      stage.candidatureId.toString() === (await req.user.getApplicationId())?.offreId.entrepriseId.toString();
    
    const isFromInstitution = req.user.role === 'etablissement' && 
      (await req.user.getInstitutionId()) === (await stage.getStudentInstitutionId());

    if (!isFromCompany && !isFromInstitution) {
      return res.status(403).json({ error: 'Accès refusé.' });
    }

    // Vérifier qu'une évaluation du même auteur n'existe pas déjà
    const existing = await Evaluation.findOne({ stageId, auteurId: req.user.id });
    if (existing) {
      return res.status(400).json({ error: 'Vous avez déjà évalué ce stage.' });
    }

    const evaluation = new Evaluation({
      stageId,
      auteurId: req.user.id,
      auteurRole: req.user.role,
      note,
      commentaires,
      competences
    });

    await evaluation.save();

    res.status(201).json({
      message: 'Évaluation enregistrée avec succès.',
      evaluation
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📊 Voir les évaluations d’un stage
exports.getEvaluationsForStage = async (req, res) => {
  try {
    const { stageId } = req.params;

    const stage = await Stage.findById(stageId);
    if (!stage) return res.status(404).json({ error: 'Stage non trouvé.' });

    const evaluations = await Evaluation.find({ stageId })
      .populate('auteurId', 'nom email') // à adapter selon ton modèle
      .sort({ createdAt: -1 });

    res.json(evaluations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};