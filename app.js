const express = require("express");
const app = express();
const { getTopics } = require("./controller")

app.get("/api/topics", getTopics)

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send(err)
  }
})
app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "bad request" })
  }
})
app.all("*", (req, res) => {
  res.status(404).send({ msg: "not found" })
})
module.exports = app;