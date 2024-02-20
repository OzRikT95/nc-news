const db = require('./db/connection');

function getAllTopics() {
  return db
    .query('SELECT slug, description FROM topics;')
    .then(({ rows }) => {
      return rows
    });
};
function getArticleById(articleId) {
  return db
    .query('SELECT * FROM articles WHERE article_id = $1', [articleId])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "not found" })
      }
      return rows[0]
    })
}

module.exports = { getAllTopics, getArticleById }