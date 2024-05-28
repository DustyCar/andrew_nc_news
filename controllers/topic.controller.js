const fetchTopics = require("../models/topic.model")

function getTopics(req, res, next) {
    return fetchTopics().then((topics) => {
      console.log(topics.rows)
      res.status(200).send({topics})
    }).catch(next)
   
}



module.exports = getTopics;