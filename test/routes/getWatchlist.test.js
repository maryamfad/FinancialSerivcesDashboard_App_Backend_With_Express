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

describe("GET /watchlist/:userId", () => {
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

		await Watchlist.create({
			userId: user._id,
			stocks: [{ stockSymbol: "AAPL" }, { stockSymbol: "GOOGL" }],
		});
	});

	after(async () => {
		await User.deleteOne({ _id: userId });
		await Watchlist.deleteOne({ userId });
	});

	it("should return the watchlist for the user", (done) => {
		chai.request(server)
			.get(`/watchlist/${userId}`)
			.set("Authorization", `Bearer ${token}`)
			.end((err, res) => {
				if (err) done(err);

				res.should.have.status(200);
				res.body.should.be.an("object");
				res.body.should.have.property("userId").eql(userId.toString());
				res.body.should.have.property("stocks").which.is.an("array");
				res.body.stocks.length.should.be.eql(2);

				done();
			});
	});

	it("should return a 404 if no watchlist is found for the user", (done) => {
		const nonExistentUserId = "000000000000000000000000"; // A userId that doesn't exist

		chai.request(server)
			.get(`/watchlist/${nonExistentUserId}`)
			.set("Authorization", `Bearer ${token}`)
			.end((err, res) => {
				if (err) done(err);

				res.should.have.status(404);
				res.body.should.have
					.property("message")
					.eql("No watchlist found for this user");

				done();
			});
	});

	it("should return a 500 status if there is an error", (done) => {
		chai.request(server)
			.get(`/watchlist/invalidUserId`)
			.set("Authorization", `Bearer ${token}`)
			.end((err, res) => {
				res.should.have.status(500);
				res.body.should.have
					.property("error")
					.eql("An error occurred while retrieving the watchlist");

				done();
			});
	});
});
