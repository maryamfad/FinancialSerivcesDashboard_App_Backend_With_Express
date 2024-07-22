import chaiHttp from "chai-http";
import server from "../../server.js";
import mongoose from "mongoose";
import User from "../../models/User.js";

let chai;
await import("chai").then((result) => (chai = result.use(chaiHttp)));

chai.use(chaiHttp);
chai.should();
const { expect } = chai;
describe("POST /trade/sell", function () {
  let testUser;
  beforeEach(function (done) {
    User.deleteMany({})
      .then(() => {
        testUser = new User({
          username: "testuser",
          password: "123456",
          balance: 1000,
          portfolio: [
            {
              stockSymbol: "AAPL",
              quantity: 10,
              purchasePrice: 150,
            },
          ],
        });
        return testUser.save();
      })
      .then(() => done())
      .catch((error) => {
        console.error("Error setting up test user:", error);
        done(error);
      });
  });

  it("should successfully sell stocks when sufficient quantity is available", function (done) {
    const sale = {
      userId: testUser._id,
      stockSymbol: "AAPL",
      quantity: 5,
      sellingPrice: 160,
    };

    chai
      .request(server)
      .post("/trade/sell")
      .send(sale)
      .end(function (err, res) {
        if (err) return done(err);

        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("balance").eql(1000 + 5 * 160);
        res.body.should.have
          .property("portfolio")
          .that.is.an("array").that.is.not.empty;
        res.body.portfolio[0].should.have.property("stockSymbol").eql("AAPL");
        res.body.portfolio[0].should.have.property("quantity").eql(5);

        User.findById(testUser._id)
          .then((updatedUser) => {
            expect(updatedUser.balance).to.equal(1000 + 5 * 160);
            expect(updatedUser.portfolio).to.have.lengthOf(1);
            expect(updatedUser.portfolio[0].stockSymbol).to.equal("AAPL");
            expect(updatedUser.portfolio[0].quantity).to.equal(5);
            done();
          })
          .catch(done);
      });
  });

  it("should return an error when insufficient stock quantity", function (done) {
    const sale = {
      userId: testUser._id,
      stockSymbol: "AAPL",
      quantity: 15,
      sellingPrice: 160,
    };
    console.log("Id is:  ", sale.userId);

    chai
      .request(server)
      .post("/trade/sell")
      .send(sale)
      .end(function (err, res) {
        if (err) done(err);
        console.log("Error is:  ", err);
        expect(res).to.have.status(400);
        expect(res.body).to.be.an("object");
        expect(res.body)
          .to.have.property("error")
          .eql("Insufficient stock quantity");
        return done();
      });
  });

  after(function (done) {
    mongoose.connection
      .dropDatabase()
      .then(() => mongoose.connection.close())
      .then(() => done())
      .catch(done);
  });
});
