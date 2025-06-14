const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  topic: { type: String, required: true },
  script: { type: String, required: true },
  audioUrl: { type: String, required: true },
  gcsPath: { type: String },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
});

const ContentModel = mongoose.model('Content', contentSchema);
module.exports = { ContentModel };
