const express = require('express')
const { register } = require('../Controllers/authorize')
const router = express()


router.post('/register', register)



module.exports = router