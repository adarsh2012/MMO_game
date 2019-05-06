module.exports = {
    ensureAuthenticated: function(req, res, next) {
      if (req.isAuthenticated()) {
        return next();
      }
      // console.log("not auth");
      //Remember it dosent matter for guests so this is just for ref
      console.log(req.body.rank);
      res.render('index');
    }
};
  