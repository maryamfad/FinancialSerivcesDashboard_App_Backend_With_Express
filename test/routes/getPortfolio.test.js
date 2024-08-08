import chaiHttp from "chai-http/index.js";
import User from "../../models/User.js";
import Order from "../../models/Order.js";
import Portfolio from "../../models/Portfolio.js";
import server from "../../server.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

let chai;
await import("chai").then((result) => (chai = result.use(chaiHttp)));

chai.should();
const { expect } = chai;

const JWT_SECRET = process.env.JWT_SECRET;
let userId;
let testUser;
let newUser;
let order1, order2;
describe("GET /trade/portfolio/:userId", () => {
	beforeEach(function (done) {
		this.timeout(10000);
		User.deleteMany({})
			.then(async () => {
				testUser = new User({
					username: "testuser",
					password: "123456",
					balance: 1000,
					portfolio: [],
				});
				userId = testUser.id;
				await testUser.save();

				newUser = new User({
					username: "newuser",
					password: "password",
					balance: 5000,
				});

				await newUser.save();
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
				console.error("Error deleting users:", error);
				done(error);
			});
	});

	const token = jwt.sign({ userId: userId }, JWT_SECRET, {
		expiresIn: "1h",
	});
	it("should retrieve the portfolio for a specific user", function (done) {
		chai.request(server)
			.get(`/trade/portfolio/${userId}`)
			.set("Authorization", `Bearer ${token}`)
			.end(function (err, res) {
				if (err) done(err);

				expect(res).to.have.status(200);
				expect(res.body).to.be.an("array");
				expect(res.body.length).to.equal(1);
				expect(res.body[0].stocks[0]).to.have.property("stockSymbol");
				expect(res.body[0].stocks[0]).to.have.property("quantity");
				expect(res.body[0].stocks[0]).to.have.property("price");

				done();
			});
	});

	it("should return a 401 if the user has no portfolio", (done) => {
		const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, {
			expiresIn: "1h",
		});
		chai.request(server)
			.get(`/trade/portfolio/${newUser._id}`)
			.set("Authorization", `Bearer ${token}`)
			.end((err, res) => {
				if (err) done(err);

				res.should.have.status(401);
				res.body.should.have.property("message");
				res.body.message.should.be.equal(
					"No portfolio found for this user"
				);
				done();
			});
	});
	after(async () => {
		await mongoose.connection.db.dropDatabase();
		await mongoose.connection.close();
	});
});
