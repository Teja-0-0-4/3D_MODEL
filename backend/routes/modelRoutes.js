// backend/routes/modelRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const ModelFile = require('../models/ModelFile');
const auth = require('../middleware/auth');
const fs = require('fs');

const router = express.Router();

// File upload configuration
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.obj', '.stl', '.gltf', '.glb'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only 3D model files allowed'));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Upload model
router.post('/upload', auth, upload.single('model'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const modelFile = new ModelFile({
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: `/uploads/${req.file.filename}`,
      userId: req.user.userId,
      fileType: path.extname(req.file.originalname).toLowerCase()
    });

    await modelFile.save();

    res.json({
      id: modelFile._id,
      filename: modelFile.filename,
      path: modelFile.path,
      fileType: modelFile.fileType
    });
  } catch (error) {
    res.status(500).json({ error: 'Error uploading file' });
  }
});

// Get user's models
router.get('/', auth, async (req, res) => {
  try {
    const models = await ModelFile.find({ userId: req.user.userId });
    res.json(models);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching models' });
  }
});

// Get specific model
router.get('/:id', auth, async (req, res) => {
  try {
    const model = await ModelFile.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!model) {
      return res.status(404).json({ error: 'Model not found' });
    }

    res.json(model);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching model' });
  }
});

// Bonus: Export model (e.g., convert STL to OBJ)
router.get('/export/:filename', auth, async (req, res) => {
  try {
    const filePath = path.join(__dirname, '../uploads', req.params.filename);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Placeholder for conversion logic
    // To implement this fully, you'd need a library like 'assimpjs' or 'three.js' converters
    // For now, we'll just serve the original file as a demo
    res.download(filePath, `exported_${req.params.filename}`, (err) => {
      if (err) {
        res.status(500).json({ error: 'Error exporting file' });
      }
    });

    // Example with conversion (commented out - requires additional setup):
    /*
    const { convert } = require('assimpjs'); // Hypothetical library
    const fileBuffer = fs.readFileSync(filePath);
    const convertedBuffer = await convert(fileBuffer, 'stl', 'obj');
    res.setHeader('Content-Disposition', 'attachment; filename="exported_model.obj"');
    res.setHeader('Content-Type', 'application/octet-stream');
    res.send(convertedBuffer);
    */
  } catch (error) {
    res.status(500).json({ error: 'Error exporting model' });
  }
});

module.exports = router;