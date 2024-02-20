const { getAllTopics, getArticleById } = require("./model")
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

module.exports = { getTopics, getEndpoints, getArticlesById }