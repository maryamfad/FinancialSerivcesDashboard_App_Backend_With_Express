// import * as chai from "chai";
import chaiHttp from "chai-http/index.js";
import server from "../../server.js";
import User from "../../models/User.js";

let chai;
await import("chai").then((result) => (chai = result.use(chaiHttp)));

chai.should();
// chai.use(chaiHttp);

describe("Users API", function () {
  // Clean up the database before each test
  beforeEach(function (done) {
    User.deleteMany({})
      .then((result) => {
        console.log("Users deleted:", result);
        done();
      })
      .catch((error) => {
        console.error("Error deleting users:", error);
        done(error);
      });
  });

  // Test the /signup route
  describe("POST /users/signup", function () {
    it("it should register a new user", (done) => {
      const user = {
        username: "testuser",
        password: "testpassword",
      };
      console.log("Sending request to /users/signup with user:", user);
      chai
        .request(server)
        .post("/users/signup")
        .send(user)
        .end((err, res) => {
          if (err) done(err);

          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("username").eql("testuser");
          done();
        });
    });
  });

  // Test the /users route
  describe("GET /users", () => {
    it("it should GET all the users", (done) => {
      chai
        .request(server)
        .get("/users")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });
});
