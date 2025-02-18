const express = require('express');
const sharp = require('sharp');
const cors = require('cors');
const resizeRoutes = require('./Routes/resizeImages')
const authorization = require('./Routes/authorize')
const {supabase} = require('./Data/db')


const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(resizeRoutes)
app.use(authorization)




app.listen(5001, () => {
  console.log('Server listening on port 5001');
});
