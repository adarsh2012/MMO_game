const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require('../config/auth');
const User = require('../db_schema/user.js');


router.get('/', ensureAuthenticated, (req, res) =>{
  User.findOne({email: req.user.email}, (err,doc) =>{
    if(!doc){
      res.render('access');
    } else{
    res.render('access',{
      //prev
      rank: doc.prevGamerank,
      time: doc.prevGametime,
      kills: doc.prevGamekills,
      points: doc.prevGamepoint,
      //avg
      avgrank: doc.avgGamerank,
      avgtime: doc.avgGametime,
      avgpoint: doc.avgGamepoint,
      //best
      bestrank: doc.bestGamerank,
      besttime: doc.bestGametime,
      bestpoint: doc.bestGamepoint,
    });
  }
  })
});






router.post('/', ensureAuthenticated, (req, res) =>{
  console.log(req.body.rank);
  var time = parseInt(req.body.time,10);
  var kills = parseInt(req.body.kills,10);
  var points = parseInt(req.body.points,10);
  var rank = parseInt(req.body.rank,10);
  User.findOne({email: req.user.email}, (err,doc) => {
    var avgGamepoint = doc.avgGamepoint;
    var avgGametime = doc.avgGametime;
    var avgGamerank = doc.avgGamerank;
    var bestGamepoint = doc.bestGamepoint;
    var bestGametime = doc.bestGametime;
    var bestGamerank = doc.bestGamerank;
    var played = doc.played;
    //change avg
    avgGamepoint = (avgGamepoint + points)/played;
    avgGametime = (avgGametime + time)/played;
    avgGamerank = (avgGamerank + rank)/played;
    //change best
    if(bestGamepoint < points){bestGamepoint = points};
    if(bestGamerank < rank){bestGamerank = rank};
    if(bestGametime < time){bestGametime = time};
    //increase play
    played = played + 1;
    //check if correct
    // console.log("Average: ",avgGamepoint,avgGamerank,avgGametime);
    // console.log("Best: ",bestGamepoint,bestGamerank,bestGametime);
    User.findOneAndUpdate({email: req.user.email}, {
      $set:{
        avgGamepoint: avgGamepoint,
        avgGamerank: avgGamerank,
        avgGametime: avgGametime,
        bestGamepoint: bestGamepoint,
        bestGamerank: bestGamerank,
        bestGametime: bestGametime,
        prevGamepoint: bestGamepoint,
        prevGamerank: rank,
        prevGametime: time,
        prevGamekills: kills,
        played : played
      }
    }, {new: true}, (err,doc) => {
      console.log(doc);
      res.redirect('/');
    });
  });
  // res.render('access', {status: "auth",  rank:req.body.rank,
  // time:req.body.time,
  // kills:req.body.kills,
  // points:req.body.points}); 
});

module.exports = router;
