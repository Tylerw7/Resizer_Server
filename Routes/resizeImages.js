const express = require('express');
const multer = require('multer');
const { resizeImage } = require('../Controllers/resizeImages');


const router = express.Router();

// Set up multer for handling image uploads
const upload = multer({ storage: multer.memoryStorage() });

// Resize image route
router.post('/resize', upload.single('image', 10), resizeImage);

// Serve static files (download ZIP files)
router.use('/downloads', express.static('downloads'));

module.exports = router;
