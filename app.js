const express = require("express");
const app = express();
const { getTopics, getEndpoints, getArticlesById, getAllArticles, getAllComments } = require("./controller")

app.get("/api/topics", getTopics)

app.get("/api", getEndpoints)

app.get("/api/articles/:article_id", getArticlesById)

app.get("/api/articles", getAllArticles)

app.get("/api/articles/:article_id/comments", getAllComments)

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send(err)
  }
  next(err)
})
app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "bad request" })
  }
  next(err)
})
app.all("*", (req, res) => {
  res.status(404).send({ msg: "not found" })
})

module.exports = app;