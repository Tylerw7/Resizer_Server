const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../Data/db') 


exports.register = async (req, res) => {
    const {email, password} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10)

    try {
        const {error} = await supabase
        .from('users')
        .insert({email: email, password: hashedPassword})

        res.json({message: "Success, user created"})
    } catch (err) {
        console.log(err)
    }
    
}
