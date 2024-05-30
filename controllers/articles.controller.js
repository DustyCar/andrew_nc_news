const {fetchArticleID, fetchArticles, fetchComments} = require("../models/articles.model")


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


exports.getComments = (req, res, next) => {
    
    const { article_id } = req.params

    return fetchComments(article_id).then((comments) => {
        res.status(200).send({comments})
    }).catch(next)
}









// module.exports= getArticleID