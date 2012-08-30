/**
 * res.tful template for new app
 * @author Jim Snodgrass jim@skookum.com
 */


var express = require('express'),
    app = express();

app.use(require('restfuljs').response);

// start server

app.listen(3000);
console.log("Started Restful test server at http://localhost:3000");

// export server as module

module.exports = app;