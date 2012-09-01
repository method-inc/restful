/**
 * res.tful template for new app
 * @author Jim Snodgrass jim@skookum.com
 */


var express = require('express'),
    app = express(),
    _ = require('underscore'),
    fs = require('fs'),
    path = require('path'),
    restful = require('restfuljs');

// Configure restfuljs here
restful.configure({});

app.configure(function() {
  // Automatically include CORS support for all requests
  app.use(function(req, res, next) {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Headers', '*');
    next();
  });
  app.use(restful.response);
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
});

app.get("/", function(req, res) {
  res.send("Restfuljs Web Server");
});

// load mongoose

app.mongoose = require('mongoose');
app.mongoose.connect('mongodb://localhost/restfuljs_app_<%= name %>', function(err) {
  if (err) throw(new Error(err.message));
});

// list all resources files
var files = require('fs').readdirSync('./resources');

var resources = {};
_.each(files, function(file) {
  var name = path.basename(file, path.extname(file));
  resources[name] = require('./resources/'+file);
  resources[name](app);
});

if(process.argv[2] == '--bootstrap') {
  // bootstrap data if argument is passed
  var d = 0;
  function done() {
    if(++d == _.keys(resources).length) {
      console.log("Finished bootstrapping data");
      process.exit();
    }
  }
  _.each(resources, function(resource, name) {
    if(fs.existsSync('./data/'+name+'.json')) {
      var bootstrap_data = require('./data/'+name+'.json');
      if(!resource.model) {
        done();
        return console.log("ERROR: " + name + " must export the model property to bootstrap data");
      }
      var mongoose_model = resource.model;
      if(_.isArray(bootstrap_data) && bootstrap_data.length > 0) {
        var d = 0;
        function model_done() {
          if(++d == bootstrap_data.length) {
            console.log("Added " + d + " documents to " + name + " model");
            return done();
          }
        }
        mongoose_model.remove(function(err) {
          if(err) {
            done();
            return console.log(err.message);
          }
          _.each(bootstrap_data, function(d) { mongoose_model.create(d, model_done); });
        });
      } else done();
    } else {
      console.log("No " + name + ".json file found in data directory");
      done();
    }
  });
}
else {
  // start server
  app.listen(<%= port %>);
  console.log("Started Restful test server at http://localhost:<%= port %>");
}

// export server as module

module.exports = app;