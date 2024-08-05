import chaiHttp from "chai-http";
import server from "../../server.js";
import mongoose from "mongoose";
import User from "../../models/User.js";
import Portfolio from "../../models/Portfolio.js";
import jwt from "jsonwebtoken";

let chai;
await import("chai").then((result) => (chai = result.use(chaiHttp)));

const JWT_SECRET = process.env.JWT_SECRET;
let token;
chai.use(chaiHttp);
chai.should();
const { expect } = chai;
describe("POST /trade/sell", function () {
	let testUser;
	beforeEach(function (done) {
    this.timeout(10000)
		User.deleteMany({})
			.then(async () => {
				testUser = new User({
					username: "testuser",
					password: "123456",
					balance: 1000,
				});
				testUser.save();
				const portfolio = new Portfolio({
					userId: testUser._id,
					stocks: [
						{
							stockSymbol: "AAPL",
							quantity: 10,
							price: 150,
						},
					],
				});

				await portfolio.save();
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
			orderType: "market",
		};
		token = jwt.sign({ userId: testUser._id }, JWT_SECRET, {
			expiresIn: "1h",
		});

		chai.request(server)
			.post("/trade/sell")
			.send(sale)
			.set("Authorization", `Bearer ${token}`)
			.end(function (err, res) {
				if (err) return done(err);

				res.should.have.status(200);
				res.body.should.be.a("object");
				res.body.user.should.have
					.property("balance")
					.eql(1000 + 5 * 160);
				// res.body.should.have
				//   .property("portfolio")
				//   .that.is.an("array").that.is.not.empty;
				// res.body.portfolio[0].should.have.property("stockSymbol").eql("AAPL");
				// res.body.portfolio[0].should.have.property("quantity").eql(5);
				// res.body.portfolio.stocks[0].should.have
				// 	.property("stockSymbol")
				// 	.eql("AAPL");
				// res.body.portfolio.stocks[0].should.have
				// 	.property("quantity")
				// 	.eql(1);
				// res.body.portfolio.stocks[0].should.have
				// 	.property("price")
				// 	.eql(150);

				User.findById(testUser._id)
					.then((updatedUser) => {
						expect(updatedUser.balance).to.equal(1000 + 5 * 160);
						// expect(updatedUser.portfolio).to.have.lengthOf(1);
						// expect(updatedUser.portfolio[0].stockSymbol).to.equal("AAPL");
						// expect(updatedUser.portfolio[0].quantity).to.equal(5);
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
		token = jwt.sign({ userId: testUser._id }, JWT_SECRET, {
			expiresIn: "1h",
		});

		chai.request(server)
			.post("/trade/sell")
			.set("Authorization", `Bearer ${token}`)
			.send(sale)
			.end(function (err, res) {
				if (err) done(err);
				expect(res).to.have.status(400);
				expect(res.body).to.be.an("object");
				expect(res.body)
					.to.have.property("error")
					.eql("Insufficient stock quantity");
				return done();
			});
	});

	after(async () => {
		await mongoose.connection.db.dropDatabase();
		await mongoose.connection.close();
	  });
});
