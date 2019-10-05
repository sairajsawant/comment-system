const router = require('express').Router();
const verify = require('./verifyToken'); 
const redis = require("redis");
require('dotenv').config();

client = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_IP)

client.on("error", function (err) {
  console.log("Error " + err);
});

router.post('/updownstate', verify , async (req, res) => {

    console.log(req.body);
    client.hget(req.user._id, req.body.commentid , function (err ,resp) {
        if(resp == 1)
            res.json({'upvoted': true, 'publisher': req.user._id})
        else if(resp == -1)
            res.json({'downvoted': true, 'publisher': req.user._id})
        else
            res.json({'upvoted' : false, 'downvoted' : false, 'publisher': req.user._id })
    })
    
})

router.put('/updownstate', verify ,async (req, res) => {
    
    console.log(req.body);
    client.hset(req.user._id, req.body.commentid , (req.body.upvoted ? 1 : -1)  , function (err ,resp) {
        console.log(resp);
        
    })
    

});

module.exports = router