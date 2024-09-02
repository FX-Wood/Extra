require("dotenv").config();
var expect = require("chai").expect;
var request = require("supertest");
var app = require("../server");
var db = require("../db/models");
var agent = request.agent(app);

before(async function () {
  this.timeout(10000);
  return db.sequelize.sync({ force: true });
});

describe("Collections Controller", function () {
  var AUTH_COOKIE;
  describe("GET /collections", function () {
    it("should redirect to /auth/login if not logged in", function (done) {
      request(app)
        .get("/collections")
        .expect("Location", "/auth/login")
        .expect(302, done);
    });

    it("should return a 200 response if logged in", function (done) {
      this.timeout(10000);
      agent
        .post("/auth/signup")
        .set("Content-Type", "application/x-www-form-urlencoded")
        .send({
          email: "test@test.com",
          name: "test",
          password: "password",
          signupCode: process.env.SIGNUP_KEY,
        })
        .expect(302)
        .expect("Location", "/")
        .end(function (error, res) {
          if (error) {
            done(error);
          } else {
            AUTH_COOKIE = res.header["set-cookie"][0];
            agent.set("Cookie", AUTH_COOKIE);
            agent.get("/collections").expect(200, done);
          }
        });
    });
  });

  describe("POST /collections", function () {
    it("should create a new collection", async function () {
      this.timeout(10000);
      // count collections
      let count = await db.collection.count();
      const res = await new Promise((resolve, reject) => {
        agent
          .post("/collections")
          .set("Cookie", AUTH_COOKIE)
          .send()
          .end((error, response) => {
            if (error) {
              reject(error);
            } else {
              resolve(response);
            }
          });
      });
      const newCount = await db.collection.count();
      expect(count).to.be.below(newCount);
    });
  });

  // describe('DELETE /collections', function() {
  //     it('should delete a collection', async function(done) {
  //         //
  //     })
  //     })
});

