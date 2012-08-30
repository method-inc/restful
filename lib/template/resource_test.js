/**
 * res.tful object template for new app objects
 * @author Jim Snodgrass jim@skookum.com
 */

module.exports = function(app){

  app.get("/user", list);
  app.post("/user", create);
  app.get("/user/:id", show);
  app.put("/user/:id", update);
  app['delete']("/user/:id", destroy);

};


var mongoose = require('mongoose');

var user = new mongoose.Schema({
  created_at: Date,
  updated_at: Date
}, {strict:false});

user.pre('save', function(next) {
  if (this.isNew) this.created_at = new Date();
  this.updated_at = new Date();
  next();
});

var userModel = mongoose.model('user', user);


function list(req, res) {
  userModel.find().exec(res.tful);
}

function create(req, res) {
  new userModel(req.body).save(res.tful);
}

function show(req, res) {
  userModel.findById(req.params.id, res.tful);
}

function update(req, res) {
  userModel.findOneAndUpdate({_id:req.params.id}, res.tful);
}

function destroy(req, res) {
  userModel.findOneAndRemove({_id:req.params.id}, res.tful);
}