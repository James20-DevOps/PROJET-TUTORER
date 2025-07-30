// controllers/stageController.js
const Stage = require('../models/Stage');
const Application = require('../models/Application');
const Offer = require('../models/Offer');
const Etudiant = require('../models/Student');

// ✅ Créer un stage à partir d'une candidature acceptée (entreprise ou établissement)
exports.createStage = async (req, res) => {
  try {
    const { applicationId, dateDebut, dateFin, tuteurEntreprise, tuteurEtablissement } = req.body;

    const application = await Application.findById(applicationId).populate('offreId');
    if (!application) return res.status(404).json({ error: 'Candidature non trouvée.' });

    // Vérifier que la candidature est acceptée
    if (application.statut !== 'acceptée') {
      return res.status(400).json({ error: 'La candidature doit être acceptée pour créer un stage.' });
    }

    // Vérifier que l'utilisateur a le droit (entreprise ou établissement)
    if (
      req.user.role === 'entreprise' &&
      application.offreId.entrepriseId.toString() !== req.user.id
    ) {
      return res.status(403).json({ error: 'Accès refusé.' });
    }

    // Vérifier que le stage n'existe pas déjà
    const existingStage = await Stage.findOne({ candidatureId: applicationId });
    if (existingStage) {
      return res.status(400).json({ error: 'Un stage existe déjà pour cette candidature.' });
    }

    const stage = new Stage({
      candidatureId: applicationId,
      dateDebut,
      dateFin,
      tuteurEntreprise,
      tuteurEtablissement,
      conventionUrl: req.body.conventionUrl, // URL du fichier uploadé
      rapportStageUrl: req.body.rapportStageUrl || null,
      statut: 'en cours'
    });

    await stage.save();

    // Mettre à jour le statut du stage dans la candidature si besoin
    res.status(201).json({
      message: 'Stage créé avec succès.',
      stage: await stage.populate('candidatureId')
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📄 Téléverser une convention de stage (étudiant ou établissement)
exports.uploadConvention = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier uploadé.' });
    }

    const stageId = req.params.stageId;
    const stage = await Stage.findById(stageId);

    if (!stage) return res.status(404).json({ error: 'Stage non trouvé.' });

    // Ici tu peux ajouter une vérification de rôle (étudiant ou établissement)
    stage.conventionUrl = `/uploads/${req.file.filename}`;
    await stage.save();

    res.json({
      message: 'Convention uploadée et liée au stage.',
      conventionUrl: stage.conventionUrl
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📊 Voir les stages d’un étudiant (étudiant ou établissement)
exports.getStudentStages = async (req, res) => {
  try {
    const userId = req.user.id;
    let stages;

    if (req.user.role === 'etudiant') {
      const student = await Etudiant.findOne({ _id: userId });
      stages = await Stage.find({ 'candidatureId.etudiantId': student._id })
        .populate('candidatureId', 'offreId')
        .populate('offreId', 'titre entrepriseId');
    } else if (req.user.role === 'etablissement') {
      // L'établissement voit tous les stages de ses étudiants
      stages = await Stage.find()
        .populate('candidatureId')
        .populate('offreId');
    } else {
      return res.status(403).json({ error: 'Accès refusé.' });
    }

    res.json(stages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};