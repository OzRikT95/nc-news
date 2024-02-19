const request = require('supertest');
const app = require('../app');
const db = require("../db/connection")
const seed = require("../db/seeds/seed")
const testData = require("../db/data/test-data/index")
const endpoints = require("../endpoints.json")

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
