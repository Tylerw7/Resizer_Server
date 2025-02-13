const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Models/user')


exports.register = async (req, res) => {
    const {email, password} = req.body;

    try {
        const hashedPass = await bcrypt.hash(password, 10)
        const user = await new User({
            email,
            password: hashedPass
        })

        await user.save();

    } catch (err) {

    }
}
