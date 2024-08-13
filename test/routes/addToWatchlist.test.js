
import chaiHttp from "chai-http/index.js";
import User from "../../models/User.js";
import Watchlist from "../../models/Watchlist.js";
import server from "../../server.js";
import jwt from "jsonwebtoken";

let chai;
await import("chai").then((result) => (chai = result.use(chaiHttp)));

chai.should();
const { expect } = chai;

const JWT_SECRET = process.env.JWT_SECRET;
describe("Watchlist API", () => {
    let token;
    let userId;
  
    before(async () => {

      const newUser = new User({
        username: "testuser",
        password: "password",
        balance: 5000,
      });
      const user = await newUser.save();
      userId = user._id;
  
      token = jwt.sign({ userId: user._id }, JWT_SECRET, {
        expiresIn: "1h",
      });
    });
  
    after(async () => {
      await User.deleteOne({ _id: userId });
      await Watchlist.deleteOne({ userId });
    });
  
    it("should add a stock to the user's watchlist", (done) => {
      chai
        .request(server)
        .post(`/watchlist/add/${userId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ stockSymbol: "AAPL" })
        .end((err, res) => {
          if (err) done(err);
  
          res.should.have.status(201);
          res.body.should.have.property("message").eql("Stock added to watchlist");
          res.body.watchlist.should.be.an("object");
          res.body.watchlist.stocks.should.be.an("array");
          res.body.watchlist.stocks.length.should.be.eql(1);
          res.body.watchlist.stocks[0].stockSymbol.should.be.eql("AAPL");
  
          done();
        });
    });
  
    it("should not add a stock that is already in the watchlist", (done) => {
      chai
        .request(server)
        .post(`/watchlist/add/${userId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ stockSymbol: "AAPL" })
        .end((err, res) => {
          if (err) done(err);
  
          res.should.have.status(400);
          res.body.should.have.property("message").eql("Stock already in watchlist");
  
          done();
        });
    });
  
    it("should return a 500 status if there is an error", (done) => {
      chai
        .request(server)
        .post(`/watchlist/add/invalidUserId`) // Intentionally invalid userId
        .set("Authorization", `Bearer ${token}`)
        .send({ stockSymbol: "AAPL" })
        .end((err, res) => {
          res.should.have.status(500);
          res.body.should.have.property("error").eql("An error occurred while adding to the watchlist");
          done();
        });
    });
  });