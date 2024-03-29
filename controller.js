const fs = require("fs/promises");
const path = require("path");
const {
  getAllTopics,
  getArticleById,
  getArticles,
  getComments,
  insertComment,
  updateArticleVotes,
  deleteComment,
  getAllUsers,
} = require("./model");

function getTopics(req, res, next) {
  getAllTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
}
function getEndpoints(req, res, next) {
  const filePath = path.join(__dirname, "endpoints.json");
  fs.readFile(filePath, "utf8")
    .then((endPoints) => {
      res.status(200).send(JSON.parse(endPoints));
    })
    .catch(next);
}
function getArticlesById(req, res, next) {
  const { article_id } = req.params;
  getArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
}
function getAllArticles(req, res, next) {
  const { topic } = req.query;
  getAllTopics()
    .then((topics) => {
      const topicsArr = topics.map((obj) => {
        return obj.slug;
      });
      if (!topicsArr.includes(topic) && topic !== undefined) {
        throw { status: 404, msg: "not found" };
      }
      return getArticles(topic);
    })
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
}
function getAllComments(req, res, next) {
  const { article_id } = req.params;
  getComments(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
}
function postComment(req, res, next) {
  const { article_id } = req.params;
  insertComment(req.body, article_id)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
}
function patchArticle(req, res, next) {
  const { article_id } = req.params;
  const { new_votes } = req.body;
  updateArticleVotes(article_id, new_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
}
function removeComment(req, res, next) {
  const { comment_id } = req.params;
  deleteComment(comment_id)
    .then(() => {
      res.status(204).send({ msg: "no content" });
    })
    .catch(next);
}
function getUsers(req, res, next) {
  getAllUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
}

module.exports = {
  getTopics,
  getEndpoints,
  getArticlesById,
  getAllArticles,
  getAllComments,
  postComment,
  patchArticle,
  removeComment,
  getUsers,
};
