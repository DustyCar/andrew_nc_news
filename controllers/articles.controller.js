const fetchArticleID = require("../models/articles.model")



function getArticleID (req, res, next){
    
    const { article_id } = req.params

        return fetchArticleID(article_id).then((article) => {
            res.status(200).send({article})
        }).catch(next)
}






module.exports= getArticleID