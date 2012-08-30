/**
 * res.tful
 * @author Jim Snodgrass jim@skookum.com
 */


var _ = require('underscore');

module.exports = {
  response: function (req, res, next) {

    var self = res;

    res.tful = function(err, result, options) {

      options = typeof options == "Object" ? options || {} : {};

      // merge default values with any incoming options
      _.defaults(options, {
        success: {
          code: 200,
          message: ""
        },
        error: {
          code: 500,
          message: err && err.message || err || ""
        }
      });

      var config = (err) ? options.error : options.success ;
      return self.send({ code:config.code, message: config.message, data: result });
    };

    next();
  },

  buildApp: function (options) {
    console.log("running build in restful.", options);

    var fs = require('fs'),
        root_dir = process.env.PWD + "/",
        app_dir = root_dir + options.dir;

    console.log("building app at: " + app_dir);
  }

};
