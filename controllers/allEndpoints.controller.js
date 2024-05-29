const endpoints = require("../endpoints.json")


function allEndpoints(req, res, next){
     return res.status(200).send({endpoints})
}

module.exports = allEndpoints