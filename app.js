const express = require("express");
const app = express();
const {
  getTopics,
  getEndpoints,
  getArticlesById,
  getAllArticles,
  getAllComments,
  postComment,
  patchArticle,
  removeComment,
  getUsers,
} = require("./controller");

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", getEndpoints);

app.get("/api/articles/:article_id", getArticlesById);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id/comments", getAllComments);

app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", patchArticle);

app.delete("/api/comments/:comment_id", removeComment);

app.get("/api/users", getUsers);

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});
app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "bad request" });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: "not found" });
  } else if (err.code === "23502") {
    res.status(400).send({ msg: "bad request" });
  } else {
    next(err);
  }
});
app.all("*", (req, res) => {
  res.status(404).send({ msg: "not found" });
});
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "internal server error" });
});

module.exports = app;
