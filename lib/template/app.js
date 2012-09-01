/**
 * res.tful template for new app
 * @author Jim Snodgrass jim@skookum.com
 */


var express = require('express'),
    app = express();

app.configure(function() {
  // Automatically include CORS support for all requests
  app.use(function(req, res, next) {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Headers', '*');
    next();
  });
  app.use(require('restfuljs').response);
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

// autoload all resources
require('underscore').each(files, function(file) {
  require('./resources/'+file)(app);
});

// start server

app.listen(<%= port %>);
console.log("Started Restful test server at http://localhost:<%= port %>");

// export server as module

module.exports = app;