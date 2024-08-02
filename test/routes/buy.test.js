import chaiHttp from "chai-http/index.js";
import server from "../../server.js";
import User from "../../models/User.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

let chai;
await import("chai").then((result) => (chai = result.use(chaiHttp)));

chai.should();
const { expect } = chai;

const JWT_SECRET = process.env.JWT_SECRET;
describe("POST /trade/buy", function () {
	let testUser;

	// Before each test, create a test user with initial balance
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
				return testUser.save();
			})
			.then(() => done())
			.catch((error) => {
				console.error("Error deleting users:", error);
				done(error);
			});
	});

	it("should successfully buy stocks when sufficient funds are available", function (done) {
		this.timeout(10000);
		const token = jwt.sign({ userId: testUser._id }, JWT_SECRET, {
			expiresIn: "1h",
		});
		const purchase = {
			userId: testUser._id,
			stockSymbol: "AAPL",
			quantity: 1,
			purchasePrice: 150,
			orderType: "market",
			balance: 10000,
		};

		chai.request(server)
			.post("/trade/buy")
			.set("Authorization", `Bearer ${token}`)
			.send(purchase)
			.end(function (err, res) {
				if (err) {
					return done(err);
				}

				res.should.have.status(200);
				res.body.should.be.a("object");
				res.body.user.should.have.property("balance").eql(850);
				res.body.user.should.have
					.property("portfolio")
					.that.is.an("array").that.is.not.empty;

				res.body.portfolio.stocks[0].should.have
					.property("stockSymbol")
					.eql("AAPL");
				res.body.portfolio.stocks[0].should.have
					.property("quantity")
					.eql(1);
				res.body.portfolio.stocks[0].should.have
					.property("price")
					.eql(150);

				res.body.order.should.have.property("stockSymbol").eql("AAPL");
				res.body.order.should.have.property("tradeType").eql("buy");
				res.body.order.should.have.property("orderType").eql("market");
				res.body.order.should.have.property("quantity").eql(1);
				res.body.order.should.have.property("price").eql(150);

				// Verify in the database
				User.findById(testUser._id)
					.then((updatedUser) => {
						expect(updatedUser.balance).to.equal(850);
						expect(updatedUser.portfolio).to.have.lengthOf(1);
						done();
					})
					.catch(done);
			});
	});

	after(async function () {
		await mongoose.connection.dropDatabase();
		await mongoose.connection.close();
	});
});
