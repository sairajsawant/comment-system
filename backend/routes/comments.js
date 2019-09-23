const router = require('express').Router();
let Comment = require('../models/comment.model')

router.route('/').get((req,res) => {
    Comment.find()
        .then(comments => res.json(comments))
        .catch(err => res.status(400).json('Error' + err));
});

module.exports = router;