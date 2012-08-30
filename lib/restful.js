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
  },
  
  bootstrap: function(options) {
    var models = options.models,
        fs = require('fs'),
        resources_dir = process.env.PWD + '/resources/',
        bootstrap_dir = process.env.PWD + '/bootstrap/';
    if(models.length == 0) {
      var files = fs.readdirSync(resources_dir);
      var num = 0;
      _(files).each(function(file) {
        if(file === 'app.js') return;
        var stat = fs.statSync(resources_dir+file);
        if (!stat.isDirectory()) {
          var name = path.basename(file, path.extname(file))
          models.push(name);
        }
      });
    }
    _.each(models, function(model) {
      var m = require(resources_dir + model);
      if(!m.model) return console.log("ERROR: " + model + " must export the model property to bootstrap data");
      var mongoose_model = m.model;
      var bootstrap_data = require(bootstrap_dir + model + '.json');
      if(bootstrap_data) {
        mongoose_model.remove(function(err) {
          if(err) return console.log(err.message);
          _.each(bootstrap_data, function(d) { new mongoose_model(d).save(); });
        });
      }
    });
  }

};
