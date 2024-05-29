const express = require("express");
const getTopics = require("./controllers/topic.controller")
const allEndpoints = require("./controllers/allEndpoints.controller")
const getArticleID = require("./controllers/articles.controller")




const app = express();



app.use(express.json());

app.get("/api", allEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleID)




//Error Handling middleware
app.use((err, req, res, next) => {  
   
   if (err.code){
    res.status(400).send({ msg: "Bad Request" });
   }
   next(err)   
})

// Custom Error Handling
app.use((err, req, res, next) => {
   if(err.msg){
      res.status(err.status).send({ msg: err.msg })
   }


})








module.exports = app;