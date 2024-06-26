const request = require("supertest");
const data = require("../db/data/test-data/index");
const app = require("../app");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const endpoints = require("../endpoints.json")
require("jest-sorted")


beforeEach(() => {
    return seed(data)
  })
  
 
 afterAll(() => {
    return db.end(); 
});


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


describe(' GET /api/articles/:article_id/comments', () => {
    test('200 status and returns an array of comments for the given article_id', () => {
        return request(app)
        .get("/api/articles/1/comments") 
        .expect(200)
       .then(({ body }) => {
           const { comments } = body
           comments.forEach((comment) => {
            
            expect(comment.article_id).toBe(1)
            expect(comment).toMatchObject({
                comment_id: expect.any(Number),
                body: expect.any(String),
                article_id: expect.any(Number),
                author: expect.any(String),
                votes: expect.any(Number),
                created_at: expect.any(String)
            })
           })
        })    
     });
     test('200 Sorted in order of most recent comment first', () => {
        return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({body}) => {
            const { comments } = body
            expect(comments).toBeSortedBy('created_at', { descending: true })
        })
     });
     test('404 status returns with an ERROR when article_id is valid but does not exist', () => {
        return request(app)
        .get("/api/articles/999/comments")
        .expect(404)
        .then(({ body }) => {
            const { msg } = body
            expect(msg).toBe("Not Found")
        })
    });
    test('400 status returns with an ERROR when article_id is an invalid type', () => {
        return request(app)
        .get("/api/articles/invalid_type/comments")
        .expect(400)
        .then(({ body }) => {
            const { msg } = body
            expect(msg).toBe("Bad Request")      
        })
    });
    test('404 status and responds with ERROR message when spelling is wrong', () => {
        return request(app)
        .get("/api/article/1/comment")
        .expect(404)
        .then(({ body }) => {
            const { msg } = body
            expect(msg).toBe("Could not find page")
        })
    });
});

describe('POST /api/articles/:article_id/comments', () => {
    test('201 status: Posts a new comment', () => {
        const commentToAdd = {
            username: "lurker",
            body: "test comment for body"
        }

        return request(app) 
        .post("/api/articles/2/comments")
        .send(commentToAdd)
        .expect(201)
        .then(({body}) => {

            const {newComment} = body

            expect(newComment).toMatchObject({
                comment_id: expect.any(Number),
                body: "test comment for body",
                votes: expect.any(Number),
                author: "lurker",
                article_id: 2,
                created_at: expect.any(String)
            })
        })
    });
    test('400 status returns with an ERROR when article_id is an invalid type', () => {
        const commentToAdd = {
            username: "lurker",
            body: "test comment for body"
        }

        return request(app)
        .post("/api/articles/invalid_type/comments")
        .send(commentToAdd)
        .expect(400)
        .then(({ body }) => {
            const { msg } = body
            expect(msg).toBe("Bad Request")      
        })
    });
    test('400 status invalid username', () => {
        const commentToAdd = {
            username: "invalid username",
            body: "test comment for body"
        }

        return request(app)
        .post("/api/articles/invalid_type/comments")
        .send(commentToAdd)
        .expect(400)
        .then(({ body }) => {
            const { msg } = body
            expect(msg).toBe("Bad Request")      
        })

    });

    test('400 status invalid type username', () => {
        const commentToAdd = {
            username: 1,
            body: "test comment for body"
        }

        return request(app)
        .post("/api/articles/invalid_type/comments")
        .send(commentToAdd)
        .expect(400)
        .then(({ body }) => {
            const { msg } = body
            expect(msg).toBe("Bad Request")      
        })

    });
    test('400 status invalid type body', () => {
        const commentToAdd = {
            username: "lurker",
            body: 1
        }

        return request(app)
        .post("/api/articles/1/comments")
        .send(commentToAdd)
        .expect(400)
        .then(({ body }) => {
            const { msg } = body
            expect(msg).toBe("Bad Request")      
        })

    });
});

 describe('PATCH /api/articles/:article_id', () => {

         test('200 status updates the vote property on an article', () => {
             const patchRequest = {inc_votes: 100}

             return request(app)
             .patch("/api/articles/1")
             .send(patchRequest)
             .expect(200)
             .then(({ body }) => {
                
                const patchedArticle = body.article
                
              
                expect(patchedArticle).toMatchObject({
                    article_id: 1,
                    title: expect.any(String),
                    topic: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String),
                    created_at: expect.any(String),
                    votes: 200,
                    article_img_url: expect.any(String)
                })
            })
         });
         test('200 status updates the vote property on an article with a minus vote number', () => {
            const patchRequest = {inc_votes: -101}

            return request(app)
            .patch("/api/articles/1")
            .send(patchRequest)
            .expect(200)
            .then(({ body }) => {
              
               const patchedArticle = body.article
               
             
               expect(patchedArticle).toMatchObject({
                   article_id: 1,
                   title: expect.any(String),
                   topic: expect.any(String),
                   author: expect.any(String),
                   body: expect.any(String),
                   created_at: expect.any(String),
                   votes: -1,
                   article_img_url: expect.any(String)
                   
               })
           })
        });
        //SAD PATH
        test('400: invalid_id', () => {
            const patchRequest = {inc_votes: 100}

            return request(app)
            .patch("/api/articles/999")
            .send(patchRequest)
            .expect(400)
            .then(({ body }) => {
                const { msg } = body
                expect(msg).toBe("Not Found")      
            })
        });

        test('404: non existent id', () => {
            const patchRequest = {inc_votes: 100}

            return request(app)
            .patch("/api/articles")
            .send(patchRequest)
            .expect(404)
            .then(({ body }) => {
                const { msg } = body
                expect(msg).toBe("Could not find page")      
            })
        });
        test('400: Empty body', () => {
            const patchRequest = {}

            return request(app)
            .patch("/api/articles/1")
            .send(patchRequest)
            .expect(400)
            .then(({ body }) => {
                const { msg } = body
                expect(msg).toBe("Bad Request")      
            })
        });

        test('400: Incorrect body', () => {
            const patchRequest = {inc_votes: "Incorrect"}

            return request(app)
            .patch("/api/articles/1")
            .send(patchRequest)
            .expect(400)
            .then(({ body }) => {
                const { msg } = body
                expect(msg).toBe("Bad Request")      
            })
        });
 });

  describe('DELETE /api/comments/:comment_id', () => {
     test('204: deletes chosen comment by comment_id', () => {
       return request(app)

         .delete('/api/comments/1')
         .expect(204)   

     });

     test('404: responds with an error when deleting a non-existent comment', () => {
        return request(app)
          .delete('/api/comments/999') 
          .expect(404)
          .then(({ body }) => {

        expect(body.msg).toBe('Comment not found');

          });
      });

      test('400: responds with an error when given an invalid comment_id', () => {
        return request(app)
          .delete('/api/comments/invalid_id') 
          .expect(400)
          .then(({ body }) => {
            
            
            expect(body.msg).toBe("Bad Request");
          });
      });

  });


  describe('GET: /api/users', () => {
    test('200: returns all users', () => {
        return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {

            
            const { users } = body
            

            expect(users).toHaveLength(4)
            users.forEach((user) => {
                expect(user).toMatchObject({
                    username: expect.any(String),
                    name: expect.any(String),
                    avatar_url: expect.any(String)
                })
            })
            
           
        })
    });
    test('404: when incorrect spelling on path respond with message', () => {
        return request(app)
        .get("/api/user")
        .expect(404)
        .then(({ body }) => {
            const { msg } = body
            expect(msg).toBe("Could not find page")
        })
    });
  });


  describe('GET: /api/articles?topic', () => {
    test('200: get articles with "cats" as its topic', () => {
        return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(({body}) => {
            const articles = body.rows;

           console.log(articles)
         articles.forEach((article) => {
               
         expect(article.topic).toBe('mitch');
         });
        })
    });
  });

  