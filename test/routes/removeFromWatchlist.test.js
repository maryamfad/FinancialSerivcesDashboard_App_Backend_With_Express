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

describe("POST /watchlist/remove/:userId", () => {
	let token;
	let userId;

	before(async () => {
		// Create a test user
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

	it("should remove a stock from the user's watchlist", (done) => {
		chai.request(server)
			.post(`/watchlist/remove/${userId}`)
			.set("Authorization", `Bearer ${token}`)
			.send({ stockSymbol: "AAPL" })
			.end(async (err, res) => {
				if (err) done(err);

				res.should.have.status(200);
				res.body.should.have
					.property("message")
					.eql("Stock removed from watchlist");
				res.body.should.have.property("watchlist");

				const updatedWatchlist = await Watchlist.findOne({ userId });
				updatedWatchlist.stocks.should.have.lengthOf(1);
				updatedWatchlist.stocks[0].stockSymbol.should.not.eql("AAPL");

				done();
			});
	});

	it("should return a 404 if the user has no watchlist", (done) => {
		const nonExistentUserId = "000000000000000000000000";

		chai.request(server)
			.post(`/watchlist/remove/${nonExistentUserId}`)
			.set("Authorization", `Bearer ${token}`)
			.send({ stockSymbol: "AAPL" })
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
			.post(`/watchlist/remove/invalidUserId`)
			.set("Authorization", `Bearer ${token}`)
			.send({ stockSymbol: "AAPL" })
			.end((err, res) => {
				res.should.have.status(500);
				res.body.should.have
					.property("error")
					.eql("An error occurred while removing from the watchlist");

				done();
			});
	});
});
