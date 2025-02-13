const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const archiver = require('archiver');

const uploadsDir = path.join(__dirname, '..', 'uploads');
const downloadsDir = path.join(__dirname, '..', 'downloads');

// Ensure directories exist
[uploadsDir, downloadsDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

exports.resizeImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image uploaded' });
        }

        // Parse sizes from request body
        const sizes = JSON.parse(req.body.sizes);
        if (!Array.isArray(sizes) || sizes.length === 0) {
            return res.status(400).json({ error: 'Invalid sizes' });
        }

        const resizedImagePaths = [];

        // Resize image for each size specified
        for (const { width, height } of sizes) {
            const fileName = `resized_${width}x${height}.jpg`;
            const filePath = path.join(uploadsDir, fileName);

            const resizedImageBuffer = await sharp(req.file.buffer)
                .resize(parseInt(width), parseInt(height), { fit: 'cover' })
                .toBuffer();

            fs.writeFileSync(filePath, resizedImageBuffer);
            resizedImagePaths.push(filePath);
        }

        // Create a ZIP file containing all resized images
        const zipPath = path.join(downloadsDir, 'resized_images.zip');
        const output = fs.createWriteStream(zipPath);
        const archive = archiver('zip');

        archive.pipe(output);
        resizedImagePaths.forEach(filePath => {
            archive.file(filePath, { name: path.basename(filePath) });
        });

        await archive.finalize();

        res.json({ zipDownloadLink: `http://localhost:5001/downloads/resized_images.zip` });
    } catch (error) {
        console.error('Error resizing image:', error);
        res.status(500).json({ error: 'An error occurred while resizing the image' });
    }
};
