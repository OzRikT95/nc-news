const { getAllTopics, getArticleById, getArticles, getComments, insertComment } = require("./model")
const fs = require("fs/promises")
const path = require("path")

function getTopics(req, res, next) {
  getAllTopics()
    .then((topics) => {
      res.status(200).send({ topics })
    })
    .catch(next)
}
function getEndpoints(req, res, next) {
  const filePath = path.join(__dirname, "endpoints.json")
  fs.readFile(filePath, "utf8")
    .then((endPoints) => {
      res.status(200).send(JSON.parse(endPoints))
    })
    .catch(next)
}
function getArticlesById(req, res, next) {
  const { article_id } = req.params
  getArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article })
    })
    .catch(next)
}

function getAllArticles(req, res, next) {
  getArticles()
    .then((articles) => {
      res.status(200).send({ articles })
    })
    .catch(next)
}

function getAllComments(req, res, next) {
  const { article_id } = req.params
  getComments(article_id)
    .then((comments) => {
      res.status(200).send({ comments })
    })
    .catch(next)
}

function postComment(req, res, next) {
  const { article_id } = req.params;
  insertComment(req.body, article_id)
    .then(comment => {
      res.status(201).send({ comment })
    })
    .catch(next)
}

module.exports = { getTopics, getEndpoints, getArticlesById, getAllArticles, getAllComments, postComment }