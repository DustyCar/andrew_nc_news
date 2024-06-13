const {fetchArticleID, fetchArticles, fetchComments, addCommentToDatabase, dbPatchArticle, dbDeleteComment} = require("../models/articles.model")


exports.getArticles = (req, res, next) => {

    const { topic } = req.query
    

    return fetchArticles(topic).then((articles)=> {
        res.status(200).send(articles)
    }).catch(next)
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

exports.postComment = (req, res, next) => {
    const { article_id } = req.params
    const { username, body } = req.body


    return addCommentToDatabase(article_id, username, body).then((newComment) => {
        
        
        res.status(201).send({newComment})
    }).catch(next)
}


exports.patchArticle = (req, res, next) => {
    const { article_id } = req.params
    const { inc_votes } = req.body

   

    return dbPatchArticle(article_id, inc_votes).then((article) => {
        
        res.status(200).send({article})
    }).catch(next)


}


exports.deleteComment = (req, res, next) => {
    const { comment_id } = req.params

    return dbDeleteComment(comment_id).then(() => {
        res.status(204).end()
    }).catch(next)
}









// module.exports= getArticleID