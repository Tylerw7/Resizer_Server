const express = require('express');
const sharp = require('sharp');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Ensure the uploads and downloads directories exist
const uploadsDir = path.join(__dirname, 'uploads');
const downloadsDir = path.join(__dirname, 'downloads');

[uploadsDir, downloadsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Set up multer for handling image uploads
const upload = multer({ storage: multer.memoryStorage() });

// Handle image resizing
app.post('/resize', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No image uploaded');
    }

    // Define sizes for resizing
    const sizes = [
      { width: 1600, height: 2000 },
      { width: 1600, height: 600 },
      { width: 3000, height: 3000 }
    ];

    const resizedImagePaths = [];

    // Resize the image for each size and save it
    for (const { width, height } of sizes) {
      const fileName = `resized_${width}x${height}.jpg`;
      const filePath = path.join(uploadsDir, fileName);

      const resizedImageBuffer = await sharp(req.file.buffer)
        .resize(width, height, { fit: 'cover' })
        .toBuffer();

      fs.writeFileSync(filePath, resizedImageBuffer);
      resizedImagePaths.push(filePath);
    }

    // Create a ZIP file with all resized images
    const zipPath = path.join(downloadsDir, 'resized_images.zip');
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip');

    archive.pipe(output);
    resizedImagePaths.forEach(filePath => {
      archive.file(filePath, { name: path.basename(filePath) });
    });

    await archive.finalize();

    // Return the download link for the ZIP file
    res.json({ zipDownloadLink: `http://localhost:5001/downloads/resized_images.zip` });
  } catch (error) {
    console.error('Error resizing image:', error);
    res.status(500).send('An error occurred while resizing the image');
  }
});

// Serve the resized images and ZIP file
app.use('/uploads', express.static(uploadsDir));
app.use('/downloads', express.static(downloadsDir));

app.listen(5001, () => {
  console.log('Server listening on port 5001');
});
