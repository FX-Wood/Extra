require("dotenv").config();
var expect = require("chai").expect;
var request = require("supertest");
var app = require("../server");
var db = require("../db/models");
const { query } = require("express");

before(async function () {
  console.log("before profile");
  this.timeout(10000);
  await db.sequelize.sync({ force: true });
  console.log("after sync profile");
});

describe("GET /profile", async function () {
  it("should redirect to /auth/login if not logged in", function (done) {
    this.timeout(10000);
    request(app)
      .get("/profile")
      .expect("Location", "/auth/login")
      .expect(302, done);
  });

  it("should return a 200 response if logged in", async function () {
    this.timeout(10000);
    const agent = request.agent(app);
    await agent
      .post("/auth/signup")
      .set("Content-Type", "application/x-www-form-urlencoded")
      .send({
        email: "my@user.co",
        name: "Brian",
        password: "password",
      })
      .expect(302)
      .expect("Location", "/");
    await agent.get("/profile").expect(200);
  });
});
