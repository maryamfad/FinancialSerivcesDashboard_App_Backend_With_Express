import mongoose from "mongoose";
import chaiHttp from "chai-http/index.js";
import server from "../../server.js";
import User from "../../models/User.js";
import dotenv from "dotenv";
dotenv.config();
let chai;
await import("chai").then((result) => (chai = result.use(chaiHttp)));

chai.should();

let userId;
let testUser;
describe("Users API", function () {
  // beforeEach(function (done) {
  //   User.deleteMany({})
  //     .then((result) => {
  //       console.log("Users deleted:", result);
  //       done();
  //     })
  //     .catch((error) => {
  //       console.error("Error deleting users:", error);
  //       done(error);
  //     });
  // });
  beforeEach(function (done) {
    this.timeout(10000);
    User.deleteMany({})
      .then(() => {
        testUser = new User({
          username: "testuser",
          password: "123456",
          balance: 1000,
          portfolio: [],
        });
        userId = testUser.id;
        return testUser.save();
      })
      .then(() => done())
      .catch((error) => {
        console.error("Error deleting users:", error);
        done(error);
      });
  });
  // Test the /users route
  describe("GET /user/all", () => {
    it("it should GET all the users", (done) => {
      chai
        .request(server)
        .get("/user/all")
        .end((err, res) => {

          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.length.should.be.eql(1);
          done();
        });
    });
  });

  describe("/GET user", () => {
    it("it should GET a user by the given id", function(done) {
      this.timeout(10000);
      chai
        .request(server)
        .get("/user/" + userId)
        .send(testUser)
        .end((err, res) => {
          if (err) return done(err);
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("username");
          res.body.should.have.property("password");
          res.body.should.have.property("_id").eql(userId);
          done();
        });
    });
  });

  after(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });
});
