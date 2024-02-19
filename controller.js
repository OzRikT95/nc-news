const { getAllTopics } = require("./model")
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
  console.log(filePath);
  fs.readFile(filePath, "utf8")
    .then((endPoints) => {
      res.status(200).send(JSON.parse(endPoints))
    })
    .catch(next)
}

module.exports = { getTopics, getEndpoints }