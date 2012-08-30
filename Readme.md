# Restfuljs

## Build App

  `npm install restfuljs -g`

  `restfuljs --help`

  `restfuljs app --help`

  `restfuljs app -d myTestApi -w 'users, projects'`


## Response

  quick and easy restful responses for expressjs apps
  
### Installation

  `npm install restfuljs`
  
### Quick Start

  add to express app middleware:
  
  `app.use(require('restfuljs').response);`


### Example uses

as direct callback to mongoose query:
  
  `models.user.findById(id, res.tful);`


another mongoose query callback example:
  
  `user.save(res.tful);`


manual call:
  
  `res.tful(error, result)`