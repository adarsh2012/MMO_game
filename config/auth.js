const crypto = require("crypto");
module.exports = {
    ensureAuthenticated: function(req, res, next) {
      if (req.isAuthenticated()) {
        return next();
      }
      console.log("not auth");
      res.render('index');
    }
};
  