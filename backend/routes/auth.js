const router = require('express').Router();
const User = require('../models/user.model');
const bcrypt = require('bcrypt');

router.post('/register',async (req, res) => {
 
    //generate hashedPassword
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create user
    const user = new User({
        username : req.body.username,
        hash : hashedPassword,
        firstName : req.body.firstName,
        lastName : req.body.lastName
    });
    try{
        const savedUser = await user.save();
        res.send(savedUser);
    }catch(err){
        res.status(400).send(err);
    }

});

// router.post('/login', (req, res) => {

// });

module.exports = router