
// this is actual function (requires underscore in this implementation)
function restful(req, res, next) {

  var self = res,
      _ = require('underscore');

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

}


// add to express app middleware
app.use(restful);


// example uses

//as direct callback to model query
models.user.findById(id, res.tful);

// another query callback example
user.save(res.tful);

//manual call
res.tful(error, response)