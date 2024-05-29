const {fetchArticleID, fetchArticles} = require("../models/articles.model")


exports.getArticles = (req, res, next) => {
    
    return fetchArticles().then((articles)=> {
        res.status(200).send(articles)
    })
}


exports.getArticleID =  (req, res, next) => {
    
    const { article_id } = req.params

        return fetchArticleID(article_id).then((article) => {
            res.status(200).send({article})
        }).catch(next)
}






// module.exports= getArticleID