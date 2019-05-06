const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require('../config/auth');
const User = require('../db_schema/user.js');


router.get('/', ensureAuthenticated, (req, res) =>{
  res.render('access', {status: "auth",  rank:req.query.rank,
                                         time:req.query.time,
                                         kills:req.query.kills,
                                         points:req.query.points}); 
  console.log(req.user.email);
  // User.findOneAndUpdate({email: req.user.email},{$set:{avgRank:"Naomi"}},{new:true},(err,doc)=>{
  //   if(err){
  //     console.log("error");
  //   }
  //   console.log(doc);
  // });
  // User.findOne({email:req.user.email}, (err,doc) => {
  //   var currentrank = parseInt(req.query.rank);
  //   var currenttime = parseInt(req.query.time);
  //   var currentpoint = parseInt(req.query.points);
  //   //avg
  //   var avgrank = parseInt(doc.avgRank);
  //   var avgtime = parseInt(doc.avgTime);
  //   var avgpoint = parseInt(doc.avgPoint);
  //   //count
  //   var count = parseInt(doc.count);
  //   //new avg
  //   console.log(avgRank+currentrank);
  //   console.log(count,avgrank,currentrank);
  // });
});

module.exports = router;