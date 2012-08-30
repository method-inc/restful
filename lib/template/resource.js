/**
 * res.tful object template for new app objects
 * @author Jim Snodgrass jim@skookum.com
 */

// Schema
var mongoose = require('mongoose');

var <%= resource%> = new mongoose.Schema({
  created_at: Date,
  updated_at: Date
}, strict:false);

<%= resource%>.pre('save', function(next) {
  if (this.isNew) this.created_at = new Date();
  this.updated_at = new Date();
  next();
});

var <%= resource%>Model = mongoose.model('<%= resource%>', <%= resource%>);

// Routes
module.exports = function(app){

  app.get("/<%= resource%>/", list);
  app.post("/<%= resource%>/", create);
  app.get("/<%= resource%>/:id", show);
  app.put("/<%= resource%>/:id", update);
  app['delete']("/<%= resource%>/:id", destroy);

};
module.exports.model = <%= resource%>Model;


function list(req, res) {
  <%= resource%>Model.find().exec(res.tful);
}

function create(req, res) {
  new <%= resource%>Model(req.body).save(res.tful);
}

function show(req, res) {
  <%= resource%>Model.findById(req.params.id, res.tful);
}

function update(req, res) {
  <%= resource%>Model.findOneAndUpdate({_id:req.params.id}, res.tful);
}

function destroy(req, res) {
  <%= resource%>Model.findOneAndRemove({_id:req.params.id}, res.tful);
}