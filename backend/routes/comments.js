const router = require('express').Router();
const Comment = require('../models/comment.model');
const verify = require('./verifyToken'); 

router.get('/', verify , (req,res) => {
    Comment.find().sort({'createdAt':-1})
        .then(comments => res.json(comments))
        .catch(err => res.status(400).json('Error' + err));
});

router.post('/add', verify,async (req,res) => {

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

router.put('/update/:id', verify, async (req,res) => {

    console.log(req.user);
    try {
        const a = await Comment.findByIdAndUpdate(req.params.id, { $inc: { upvotes : req.body.upvotes, downvotes: req.body.downvotes }});
        res.send({ "success": true });
    }catch(err){
        res.status(400).send(err);
    }
})


module.exports = router;