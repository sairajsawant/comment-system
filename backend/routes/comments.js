const router = require('express').Router();
const Comment = require('../models/comment.model');
const verify = require('./verifyToken'); 

router.get('/comments', verify , (req,res) => {
    Comment.find()
        .then(comments => res.json(comments))
        .catch(err => res.status(400).json('Error' + err));
});

router.post('/comment/add', verify,async (req,res) => {

    console.log(req.user);
    const comment = new Comment({

        user : req.user._id,
        content : req.body.content

    });
    try {
        const savedComment = await comment.save();
        res.send({commentid : savedComment._id }); 
    }catch(err){
        res.status(400).send(err);
    }
})

module.exports = router;