/**
 * res.tful template for new app
 * @author Jim Snodgrass jim@skookum.com
 */


var express = require('express'),
    app = express();

app.configure(function() {
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
app.mongoose.connect('mongodb://localhost/restfuljs_app', function(err) {
  if (err) throw(new Error(err.message));
});

var user = require('./user');

// start server

app.listen(3000);
console.log("Started Restful test server at http://localhost:3000");

// export server as module

module.exports = app;