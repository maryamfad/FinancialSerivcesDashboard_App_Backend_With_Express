const getOrderQuote = async (symbol) => {
	if (!symbol || typeof symbol !== "string") {
		throw new Error("Invalid stock symbol provided");
	}

	const url = `https://financialmodelingprep.com/api/v3/quote-order/${symbol}?apikey=${process.env.FINANCIAL_MODELING_PREP_API_KEY}`;
	try {
		const response = await fetch(url, {
			method: "GET",
		});

		if (!response.ok) {
			throw new Error(
				`HTTP error! Status: ${response.status} - ${response.statusText}`
			);
		}
		const data = await response.json();
		if (!Array.isArray(data) || data.length === 0 || !data[0].price) {
			throw new Error(data["Error Message"]);
		} else {
			return data[0];
		}
	} catch (error) {
		if (error.name === "FetchError") {
			console.error("Network error or timeout occurred:", error.message);
		} else {
			console.error("An error occurred:", error.message);
		}
	}
};
export default getOrderQuote;
