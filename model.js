const db = require("./db/connection");
const { values } = require("./db/data/test-data/articles");

function getAllTopics() {
  return db.query("SELECT slug, description FROM topics;").then(({ rows }) => {
    return rows;
  });
}
function getArticleById(articleId) {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [articleId])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "not found" });
      }
      return rows[0];
    });
}
function getArticles(topic) {
  let query = "SELECT * FROM articles";
  const topics = [];
  if (topic) {
    query += " WHERE topic = $1";
    topics.push(topic);
  }
  query += " ORDER BY created_at DESC";
  return db.query(query, topics).then(({ rows }) => {
    if (rows.length === 0) {
      throw { status: 404, msg: "not found" };
    }
    return rows;
  });
}
function getComments(articleId) {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [articleId])
    .then(({ rows }) => {
      if (rows.length === 0) {
        throw { status: 404, msg: "not found" };
      } else {
        return db
          .query("SELECT * FROM comments WHERE article_id = $1", [articleId])
          .then(({ rows }) => {
            return rows;
          });
      }
    });
}
function insertComment({ username, body }, articleId) {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [articleId])
    .then(({ rows }) => {
      if (rows.length === 0) {
        throw { status: 404, msg: "not found" };
      }
      return db.query(
        "INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *",
        [articleId, username, body]
      );
    })
    .then(({ rows }) => {
      return rows[0];
    });
}
function updateArticleVotes(articleId, newVotes) {
  return db
    .query(
      "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;",
      [newVotes, articleId]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        throw { status: 404, msg: "not found" };
      }
      return rows[0];
    });
}
function deleteComment(commentId) {
  return db
    .query("DELETE FROM comments WHERE comment_id = $1 RETURNING *;", [
      commentId,
    ])
    .then(({ rows }) => {
      if (rows.length === 0) {
        throw { status: 404, msg: "not found" };
      }
      return rows;
    });
}
function getAllUsers() {
  return db
    .query("SELECT username, name, avatar_url FROM users")
    .then(({ rows }) => {
      return rows;
    });
}
module.exports = {
  getAllTopics,
  getArticleById,
  getArticles,
  getComments,
  insertComment,
  updateArticleVotes,
  deleteComment,
  getAllUsers,
};
