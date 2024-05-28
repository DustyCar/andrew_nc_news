const request = require("supertest");
const data = require("../db/data/test-data/index");
const app = require("../app");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");


beforeEach(() => {
    return seed(data)
  })
  
  afterAll(() => db.end())


describe("GET /api/topics", () => {
    test('200 status and responds with all topics', () => {
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then((response) => {
            const topics = response.body.topics.rows;
            expect(topics).toHaveLength(3) 
            topics.forEach((topic) => {
                expect(topic).toMatchObject({
                    description: expect.any(String), 
                    slug: expect.any(String)
                })
            })
        })
    });
    test('404 status and responds with message', () => {
        return request(app)
        .get("/api/topic")
        .expect(404)
    });
})
