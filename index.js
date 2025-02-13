const express = require('express');
const sharp = require('sharp');
const cors = require('cors');

const resizeRoutes = require('./Routes/resizeImages')

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(resizeRoutes)


app.listen(5001, () => {
  console.log('Server listening on port 5001');
});
