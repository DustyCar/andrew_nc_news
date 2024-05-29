const request = require("supertest");
const data = require("../db/data/test-data/index");
const app = require("../app");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const endpoints = require("../endpoints.json")


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

describe("GET /api", () => {
    test("200 status and returns all current endpoints", () => {
        return request(app)
        .get("/api")
        .expect(200)
        .then((response) => {
            
            expect(response.body).toEqual({endpoints})
        })
       
        
    })
})

describe("GET /api/articles/:article_id", () => {
    test("200 status and responds with a single article object", () => {
        return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then((response) => {
            const article = response.body.article;
            expect(article).toHaveLength(1)
            expect(article[0]).toMatchObject({
                article_id: expect.any(Number),
                title: expect.any(String),
                topic: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String)
            }) 
        })
    })
    test('400 status returns with an ERROR when article_id is an invalid type', () => {
        return request(app)
        .get("/api/articles/invalid_type")
        .expect(400)
        .then(({ body }) => {
            const { msg } = body
            expect(msg).toBe("Bad Request")      
        })
    });
    test('404 status returns with an ERROR when article_id is valid but does not exist', () => {
        return request(app)
        .get("/api/articles/999")
        .expect(404)
        .then(({ body }) => {
            const { msg } = body
            expect(msg).toBe("Not Found")
        })
    });
})

describe('GET /api/articles', () => {
    test('200 status and returns all articles without a body property and a new property comment_count', () => {
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
            console.log(response.body.rows)
            const articles = response.body.rows
         // expect(articles).toHaveLength(13)
         articles.forEach((article) => {
            
            expect(article).toMatchObject({
                article_id: expect.any(Number),
                title: expect.any(String),
                topic: expect.any(String),
                author: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String),
                comment_count: expect.any(String)
                
            })
         })

        } )
    });

    test('200 status and returns all articles sorted by date in decending Order', () => {
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
            const articles = response.body.rows;
            expect(articles[0].article_id).toBe(3)

        })     
    });
    test('404 status and responds with message', () => {
        return request(app)
        .get("/api/article")
        .expect(404)
        .then(({ body }) => {
            const { msg } = body
            expect(msg).toBe("Could not find page")
        })
    });
});
