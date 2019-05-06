const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require('../config/auth');



router.get('/', ensureAuthenticated, (req, res) =>{
  res.render('access', {status: "auth",  user:req.user});  
});

module.exports = router;