import mongoose from "mongoose";
import chaiHttp from "chai-http/index.js";
import server from "../../server.js";
import User from "../../models/User.js";
import dotenv from "dotenv";
dotenv.config();
let chai;
await import("chai").then((result) => (chai = result.use(chaiHttp)));

chai.should();
describe("Users API", function () {
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

  after(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });
});
