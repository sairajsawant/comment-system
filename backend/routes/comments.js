const router = require('express').Router();
const Comment = require('../models/comment.model');
const verify = require('./verifyToken'); 

router.get('/', verify , (req,res) => {
    Comment.find()
        .then(comments => res.json(comments))
        .catch(err => res.status(400).json('Error' + err));
});

module.exports = router;