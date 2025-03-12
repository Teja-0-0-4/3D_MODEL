// backend/models/ModelFile.js
const mongoose = require('mongoose');

const modelFileSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  fileType: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('ModelFile', modelFileSchema);