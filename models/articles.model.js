const db = require("../db/connection")



exports.fetchArticles = () => {
    return db.query(
`SELECT   
    articles.article_id, 
    articles.title, 
    articles.topic, 
    articles.author, 
    articles.created_at, 
    articles.votes, 
    articles.article_img_url,
    COUNT(comments.article_id) AS comment_count
FROM 
    articles 
JOIN 
    comments ON articles.article_id = comments.article_id
GROUP BY
    articles.article_id
ORDER BY 
    articles.created_at DESC;` 
    ).then((articles) => {
        return articles
    })
}







exports.fetchArticleID = (article_id) => {  
    return db.query(`SELECT * FROM articles WHERE article_id =
    $1`, [article_id]).then((result) => {

        if(result.rows.length === 0){
            return Promise.reject({status: 404, msg: "Not Found"})
        }
       
        return result.rows
    })

    
}



// module.exports = fetchArticleID