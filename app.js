const express = require("express");
const getTopics = require("./controllers/topic.controller")





const app = express();



app.use(express.json());

app.get("/api/topics", getTopics);



app.use((err, req, res, next) => {
   if (err.code === "22P02"){
    res.status(400).send({ msg: "Bad Request" });
   }
   
})



module.exports = app;