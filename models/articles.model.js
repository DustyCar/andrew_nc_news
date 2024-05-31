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


exports.fetchComments = (article_id) => {
   return db.query(
`SELECT * 
 FROM 
    comments 
 WHERE
    comments.article_id = $1
 ORDER BY
    comments.created_at DESC`, [article_id]).then(({rows}) => {

        if(rows.length === 0){
            return Promise.reject({status: 404, msg: "Not Found"})
        }


        return rows;
    })
}



exports.addCommentToDatabase = (article_id, username, body) =>{

    //ERROR
    if (typeof username !== "string" || typeof body !== "string") {
        return Promise.reject({status: 400, msg: "Bad Request"})
    }



   return db.query(
`INSERT INTO 
    comments (article_id, author, body)
VALUES
    ($1, $2, $3)
    RETURNING *`, [article_id, username, body]
     ).then((result) => {
       
         return result.rows[0]
     })

}


exports.dbPatchArticle = (article_id, inc_votes) => {
    
    return db.query(
 `UPDATE 
     articles
        SET votes = votes + $1
           WHERE article_id = $2
                  RETURNING *;`,
        [inc_votes, article_id]
    ).then((article) => {

        if(article.rows.length === 0){
            return Promise.reject({status: 400, msg: "Not Found"})
        }
        
        return article.rows[0];
    });

}