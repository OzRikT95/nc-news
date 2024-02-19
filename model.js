const db = require('./db/connection');

function getAllTopics() {
  return db.query('SELECT slug, description FROM topics;')

    .then(({ rows }) => {
      return rows
    });
};

module.exports = { getAllTopics }