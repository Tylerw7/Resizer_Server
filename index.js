const express = require('express');
const sharp = require('sharp');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

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
      { width: 100, height: 100 },
      { width: 300, height: 300 },
      { width: 500, height: 500 }
    ];

    const outputLinks = [];

    // Resize the image for each size and save it to the uploads folder
    for (const { width, height } of sizes) {
      const resizedImageBuffer = await sharp(req.file.buffer)
        .resize(width, height)
        .toBuffer();

      const fileName = `resized_${width}x${height}.jpg`;
      const filePath = path.join(uploadsDir, fileName);

      // Save the resized image to the uploads directory
      fs.writeFileSync(filePath, resizedImageBuffer);

      // Generate a link to the resized image
      outputLinks.push(`http://localhost:5001/uploads/${fileName}`);
    }

    // Return the links to the resized images
    res.json({ links: outputLinks });
  } catch (error) {
    console.error('Error resizing image:', error);
    res.status(500).send('An error occurred while resizing the image');
  }
});

// Serve the resized images from the "uploads" directory
app.use('/uploads', express.static(uploadsDir));

app.listen(5001, () => {
  console.log('Server listening on port 5001');
});
