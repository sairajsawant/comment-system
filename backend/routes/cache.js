const router = require('express').Router();
const verify = require('./verifyToken'); 
const redis = require("redis");
client = redis.createClient(6379, '172.17.0.3')

client.on("error", function (err) {
  console.log("Error " + err);
});

router.post('/updownstate', verify , async (req, res) => {

    console.log(req.body);
    client.hget(req.user._id, req.body.commentid , function (err ,resp) {
        if(resp == 1)
            res.json({'upvoted': true})
        else if(resp == -1)
            res.json({'downvoted': true})
        else
            res.json({'upvoted' : false, 'downvoted' : false })
    })
    
})

router.put('/updownstate',async (req, res) => {
    


});

module.exports = router