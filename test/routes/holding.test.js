import chaiHttp from "chai-http/index.js";
import User from "../../models/User.js";
import Portfolio from "../../models/Portfolio.js";
import server from "../../server.js";
import jwt from "jsonwebtoken";

let chai;
await import("chai").then((result) => (chai = result.use(chaiHttp)));

chai.should();

describe("GET /portfolio/holdings/:userId", () => {
	const JWT_SECRET = process.env.JWT_SECRET;
	let userId;
	let token;

	before(async () => {
		const user = new User({
			username: "testuser",
			password: "password",
			balance: 10000,
		});
		await user.save();
		userId = user._id;
		token = jwt.sign({ userId: user._id }, JWT_SECRET, {
			expiresIn: "1h",
		});
	});

	after(async () => {
		await User.deleteMany({});
		await Portfolio.deleteMany({});
	});

	it("should return the top holdings in a user's portfolio", async () => {
		const portfolio = new Portfolio({
			userId: userId,
			stocks: [
				{ stockSymbol: "AAPL", quantity: 10, price: 150 },
				{ stockSymbol: "GOOGL", quantity: 5, price: 2000 },
			],
		});
		await portfolio.save();

		const res = await chai
			.request(server)
			.get(`/portfolio/holdings/${userId}`)
			.set("Authorization", `Bearer ${token}`);

		res.should.have.status(200);
		res.body.should.be.an("array");
		res.body.length.should.be.eql(2);
		res.body[0].should.have.property("stockSymbol");
		res.body[0].should.have.property("quantity");
		res.body[0].should.have.property("value");
		res.body[0].should.have.property("percentage");
	});

	it("should return a 404 if the portfolio is empty", async () => {
		const newUser = new User({
			username: "testuser1",
			password: "password",
			balance: 10000,
		});
		await newUser.save();
		const res = await chai
			.request(server)
			.get(`/portfolio/holdings/${newUser._id}`)
			.set("Authorization", `Bearer ${token}`);

		res.should.have.status(404);
		res.body.should.have.property("message");
		res.body.message.should.be.equal("No portfolio found for this user");
	});

	it("should return a 404 if the user has no portfolio", async () => {
		const newUser = new User({
			username: "nouserportfolio",
			password: "password",
			balance: 5000,
		});
		await newUser.save();

		const newToken = jwt.sign({ userId: newUser._id }, JWT_SECRET, {
			expiresIn: "1h",
		});

		const res = await chai
			.request(server)
			.get(`/portfolio/holdings/${newUser._id}`)
			.set("Authorization", `Bearer ${newToken}`);

		res.should.have.status(404);
		res.body.should.have.property("message");
		res.body.message.should.be.equal("No portfolio found for this user");
	});

	it("should return a 400 for an invalid userId", async () => {
		const invalidUserId = "12345";

		const res = await chai
			.request(server)
			.get(`/portfolio/holdings/${invalidUserId}`)
			.set("Authorization", `Bearer ${token}`);

		res.should.have.status(500);
		res.body.should.have.property("error");
		res.body.error.should.be.equal(
			"An error occurred while retrieving the holdings"
		);
	});
});
