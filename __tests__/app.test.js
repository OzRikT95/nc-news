const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const endpoints = require("../endpoints.json");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api/topics", () => {
  test("responds with an array of topics", async () => {
    const { body } = await request(app).get("/api/topics").expect(200);
    expect(body.topics).toBeInstanceOf(Array);
  });
  test("GET /api/topics should respond with 400 if bad request", async () => {
    const { body } = await request(app).get("/api/topic").expect(404);
    expect(body.msg).toBe("not found");
  });
});
describe("GET /api", () => {
  test("GET /api should respond with JSON describing all endpoints", async () => {
    const { body } = await request(app).get("/api").expect(200);
    expect(body).toEqual(endpoints);
  });
});
describe("GET /api/articles/:article_id", () => {
  test("should respond with the article requested by id", async () => {
    const { body } = await request(app).get("/api/articles/1").expect(200);
    expect(body.article).toEqual({
      article_id: 1,
      title: "Living in the shadow of a great man",
      topic: "mitch",
      author: "butter_bridge",
      body: "I find this existence challenging",
      created_at: "2020-07-09T20:11:00.000Z",
      votes: 100,
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    });
  });
  test("responds with an error for valid but non-existant id", async () => {
    const { body } = await request(app).get("/api/articles/100000").expect(404);
    expect(body.msg).toBe("not found");
  });
  test("reponds with an error for invalid id", async () => {
    const { body } = await request(app).get("/api/articles/one").expect(400);
    expect(body.msg).toBe("bad request");
  });
});
describe("/api/articles", () => {
  describe("GET /api/articles", () => {
    test("responds with articles when a get requested is used", async () => {
      const { body } = await request(app).get("/api/articles").expect(200);
      expect(body.articles.length).not.toBe(0);
      body.articles.forEach((article) => {
        expect(article).toEqual(
          expect.objectContaining({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          })
        );
      });
    });
    test("responds with all articles, in descending order by date", async () => {
      const { body } = await request(app).get("/api/articles").expect(200);
      expect(body.articles).toBeSortedBy("created_at", { descending: true });
    });
  });
  describe("GET /api/articles (topic query)", () => {
    test("repond with array of articles filtered by topic", async () => {
      const { body } = await request(app)
        .get("/api/articles?topic=mitch")
        .expect(200);
      expect(body.articles).toBeInstanceOf(Array);
    });
    test("should repsond with err when no invalid topic ", async () => {
      const { body } = await request(app)
        .get("/api/articles?topic=mit")
        .expect(404);
      expect(body.msg).toBe("not found");
    });
  });
});
describe("GET /api/articles/article_id/comments", () => {
  test("respond with comments bt article_id with a GET request", async () => {
    const { body } = await request(app)
      .get("/api/articles/1/comments")
      .expect(200);
    expect(body.comments.length).not.toBe(0);
    body.comments.forEach((comment) => {
      expect(comment).toEqual(
        expect.objectContaining({
          comment_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          article_id: expect.any(Number),
        })
      );
    });
  });
  test("respond with err when valid id but non-existant", async () => {
    const { body } = await request(app)
      .get("/api/articles/100000000/comments")
      .expect(404);
    expect(body.msg).toBe("not found");
  });
  test("respond with err when invalid id", async () => {
    const { body } = await request(app)
      .get("/api/articles/one/comments")
      .expect(400);
    expect(body.msg).toBe("bad request");
  });
  test("respond with an article with no comments", async () => {
    const { body } = await request(app)
      .get("/api/articles/2/comments")
      .expect(200);
    expect(body.comments.length).toBe(0);
  });
});
describe("POST /api/articles/:article_id/comments", () => {
  test("responds with the posted comment", async () => {
    const { body } = await request(app)
      .post("/api/articles/1/comments")
      .send({ username: "butter_bridge", body: "is the best" })
      .expect(201);
    expect(body.comment).toEqual(
      expect.objectContaining({
        article_id: expect.any(Number),
        author: "butter_bridge",
        body: "is the best",
      })
    );
  });
  test("responds with err for valid but non-existant id", async () => {
    const { body } = await request(app)
      .post("/api/articles/100000/comments")
      .send({ username: "butter_bridge", body: "is the best" })
      .expect(404);
    expect(body.msg).toBe("not found");
  });
  test("responds with err for invalid id", async () => {
    const { body } = await request(app)
      .post("/api/articles/one/comments")
      .send({ username: "butter_bridge", body: "is the best" })
      .expect(400);
    expect(body.msg).toBe("bad request");
  });
  test("responds with err when username not found", async () => {
    const { body } = await request(app)
      .post("/api/articles/1/comments")
      .send({ username: "rikki", body: "is the best" })
      .expect(404);
    expect(body.msg).toBe("not found");
  });
});
describe("PATCH /api/articles/:article_id", () => {
  test("respond with the patched article", async () => {
    const { body } = await request(app)
      .patch("/api/articles/1")
      .send({ new_votes: 1 })
      .expect(200);
    expect(body.article.votes).toBe(101);
  });
  test("responds with err for valid but non-existant id", async () => {
    const { body } = await request(app)
      .patch("/api/articles/100000000")
      .send({ new_votes: 1 })
      .expect(404);
    expect(body.msg).toBe("not found");
  });
  test("responds with err for invalid id", async () => {
    const { body } = await request(app)
      .patch("/api/articles/one")
      .send({ new_votes: 1 })
      .expect(400);
    expect(body.msg).toBe("bad request");
  });
  test("responds with err for invalid votes", async () => {
    const { body } = await request(app)
      .patch("/api/articles/1")
      .send({ new_votes: "one" })
      .expect(400);
    expect(body.msg).toBe("bad request");
  });
});
describe("DELETE /api/comments/:comment_id", () => {
  test("respond with 204 for deleted comment", async () => {
    await request(app).delete("/api/comments/1").expect(204);
  });
  test("respond with err with given valid id but non-existant", async () => {
    const { body } = await request(app)
      .delete("/api/comments/1000000")
      .expect(404);
    expect(body.msg).toBe("not found");
  });
  test("respond with err when given invalid id", async () => {
    const { body } = await request(app).delete("/api/comments/one").expect(400);
    expect(body.msg).toBe("bad request");
  });
});
describe("GET /api/users", () => {
  test("responds with an array of users", async () => {
    const { body } = await request(app).get("/api/users").expect(200);
    expect(body.users).toBeInstanceOf(Array);
  });
  test("respond with err when given invalid url", async () => {
    const { body } = await request(app).get("/api/user").expect(404);
    expect(body.msg).toBe("not found");
  });
});
