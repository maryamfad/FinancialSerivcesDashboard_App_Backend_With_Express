import chaiHttp from "chai-http/index.js";
import User from "../../models/User.js";
import Order from "../../models/Order.js";
import server from "../../server.js";
import jwt from "jsonwebtoken";
import { blacklist, addToBlacklist } from "../../routes/auth.js";

let chai;
await import("chai").then((result) => (chai = result.use(chaiHttp)));

chai.should();
const { expect } = chai;

const JWT_SECRET = process.env.JWT_SECRET;
let userId;
let testUser;
let newUser;
let order1, order2;
describe("GET /trade/orders/:userId", () => {
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
				order1 = new Order({
					userId: testUser.id,
					stockSymbol: "AAPL",
					tradeType: "buy",
					orderType: "market",
					quantity: 10,
					price: 150,
					status: "executed",
					executedAt: new Date(),
				});

				order2 = new Order({
					userId: testUser.id,
					stockSymbol: "GOOGL",
					tradeType: "sell",
					orderType: "limit",
					quantity: 5,
					price: 2000,
					status: "executed",
					executedAt: new Date(),
				});

				await order1.save();
				await order2.save();
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
	it("should retrieve all orders for a specific user", function (done) {
		chai.request(server)
			.get(`/trade/orders/${userId}`)
			.set("Authorization", `Bearer ${token}`)
			.end(function (err, res) {
				if (err) done(err);

				expect(res).to.have.status(200);
				expect(res.body).to.be.an("array");
				expect(res.body.length).to.equal(2);

				const order = res.body[0];
				expect(order).to.have.property("stockSymbol");
				expect(order).to.have.property("tradeType");
				expect(order).to.have.property("orderType");
				expect(order).to.have.property("quantity");
				expect(order).to.have.property("price");
				expect(order).to.have.property("status");
				expect(order).to.have.property("executedAt");
				done();
			});
	});

	it("should return a 401 if the user has no orders", (done) => {
		const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, {
			expiresIn: "1h",
		});
		chai.request(server)
			.get(`/trade/orders/${newUser._id}`)
			.set("Authorization", `Bearer ${token}`)
			.end((err, res) => {
				if (err) done(err);

				res.should.have.status(401);
				res.body.should.have.property("message");
				res.body.message.should.be.equal(
					"No orders found for this user"
				);
				done();
			});
	});
	after(async () => {
		await User.deleteMany({});
		await Order.deleteMany({});
	});
});
