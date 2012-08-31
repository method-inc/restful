/**
 * res.tful
 * @author Jim Snodgrass jim@skookum.com
 */


var _ = require('underscore'),
    fs = require('fs');

var globalOptions = {
  wrapper: true
};

module.exports = {

  configure: function(options) {
    _.extend(globalOptions, options);
  },

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
      var output = (globalOptions.wrapper) ? { code:config.code, message: config.message, data: result } : err || result;
      return self.send(output);
    };

    next();
  },

  buildApp: function (options) {
    var root_dir = process.env.PWD + "/",
        app_dir = root_dir + options.dir + '/';

    console.log("building app at: " + app_dir);
    
    fs.mkdirSync(app_dir);
    copyFile( '../lib/template/app.js', app_dir + 'app.js');
    copyFile( '../lib/template/package.json', app_dir + 'package.json');
    
    fs.mkdirSync(app_dir + 'resources/');
    var template = _.template( fs.readFileSync('../lib/template/resource.js', 'utf-8') );
    _.each(options['with'], function(resource) {
      fs.writeFileSync(app_dir + 'resources/' + resource + '.js', template({ resource: resource }), 'utf-8');
    });
  },
  
  bootstrap: function(options) {
    var models = options.models,
        fs = require('fs'),
        resources_dir = process.env.PWD + '/resources/',
        bootstrap_dir = process.env.PWD + '/bootstrap/';
    if(models.length === 0) {
      var files = fs.readdirSync(resources_dir);
      var num = 0;
      _(files).each(function(file) {
        if(file === 'app.js') return;
        var stat = fs.statSync(resources_dir+file);
        if (!stat.isDirectory()) {
          var name = path.basename(file, path.extname(file));
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

function copyFile(src, dest) {
  fs.writeFileSync(dest, fs.readFileSync(src), 'utf-8');
}
