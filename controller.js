const { getAllTopics } = require("./model")

function getTopics(req, res, next) {
  getAllTopics()
    .then((topics) => {
      res.status(200).send({ topics })
    })
    .catch(next)
}

module.exports = { getTopics }