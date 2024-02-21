const request = require('supertest');
const app = require('../app');
const db = require("../db/connection")
const seed = require("../db/seeds/seed")
const testData = require("../db/data/test-data/index")
const endpoints = require("../endpoints.json");
const { expect } = require('@jest/globals');

beforeEach(() => seed(testData))
afterAll(() => db.end())

describe('GET /api/topics', () => {
  test('responds with an array of topics', async () => {
    const { body } = await request(app).get("/api/topics").expect(200)
    expect(body.topics).toBeInstanceOf(Array)
  });
  test('GET /api/topics should respond with 400 if bad request', async () => {
    const { body } = await request(app).get("/api/topic").expect(404)
    expect(body.msg).toBe("not found")
  });
});
describe('GET /api', () => {
  test('GET /api should respond with JSON describing all endpoints', async () => {
    const { body } = await request(app).get("/api").expect(200)
    expect(body).toEqual(endpoints)
  });
});
describe('GET /api/articles/:article_id', () => {
  test('should respond with the article requested by id', async () => {
    const { body } = await request(app).get("/api/articles/1").expect(200)
    expect(body.article).toEqual({
      article_id: 1,
      title: 'Living in the shadow of a great man',
      topic: 'mitch',
      author: 'butter_bridge',
      body: 'I find this existence challenging',
      created_at: '2020-07-09T20:11:00.000Z',
      votes: 100,
      article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
    })
  });
  test('responds with an error for valid but non-existant id', async () => {
    const { body } = await request(app).get("/api/articles/100000").expect(404)
    expect(body.msg).toBe("not found")
  });
  test('reponds with an error for invalid id', async () => {
    const { body } = await request(app).get("/api/articles/one").expect(400)
    expect(body.msg).toBe("bad request")
  });
});
describe('GET /api/articles', () => {
  test('responds with articles a get requested is used', async () => {
    const { body } = await request(app).get("/api/articles").expect(200)
    expect(body.articles.length).not.toBe(0)
    body.articles.forEach(article => {
      expect(article).toEqual(expect.objectContaining({
        article_id: expect.any(Number),
        title: expect.any(String),
        topic: expect.any(String),
        author: expect.any(String),
        body: expect.any(String),
        created_at: expect.any(String),
        votes: expect.any(Number),
        article_img_url: expect.any(String)
      }))
    });
  });
  test('responds with all articles, in descending order by date', async () => {
    const { body } = await request(app).get("/api/articles").expect(200)
    expect(body.articles).toBeSortedBy("created_at", { descending: true })
  });
});
