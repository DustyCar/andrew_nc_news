const fetchTopics = require("../models/topic.model")


function getTopics(req, res, next) {
    return fetchTopics().then((topics) => {
      
      res.status(200).send({topics})
    }).catch(next)
   
}

//function allEndpoints(req, res, next){
 //    return res.status(200).send({endpoints})
//}



module.exports = getTopics
