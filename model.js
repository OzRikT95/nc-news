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

function getArticles() {
  return db
    .query('SELECT * FROM articles ORDER BY created_at DESC')
    .then(({ rows }) => {
      return rows
    })
}

function getComments(articleId) {
  return db
    .query('SELECT * FROM articles WHERE article_id = $1', [articleId])
    .then(({ rows }) => {
      if (rows.length === 0) {
        throw { status: 404, msg: "not found" }
      } else {
        return db
          .query('SELECT * FROM comments WHERE article_id = $1', [articleId])
          .then(({ rows }) => {
            return rows
          })
      }
    })
}

function insertComment({ username, body }, articleId) {
  return db
    .query('SELECT * FROM articles WHERE article_id = $1', [articleId])
    .then(({ rows }) => {
      if (rows.length === 0) {
        throw { status: 404, msg: "not found" };
      }
      return db
        .query(
          'INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *',
          [articleId, username, body]
        );
    })
    .then(({ rows }) => {
      return rows[0]
    });
}

module.exports = { getAllTopics, getArticleById, getArticles, getComments, insertComment }