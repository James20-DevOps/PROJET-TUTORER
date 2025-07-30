// models/Document.js
const documentSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    stageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Stage'
    },
    type: {
      type: String,
      enum: ['cv', 'lettre', 'convention', 'rapport', 'attestation', 'evaluation']
    },
    url: {
      type: String,
      required: true
    },
    nom: {
      type: String
    },
    estValide: {
      type: Boolean,
      default: false
    }
  }, {
    timestamps: true
  });
  
  module.exports = mongoose.model('Document', documentSchema);