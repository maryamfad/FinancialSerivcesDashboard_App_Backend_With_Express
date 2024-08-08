const fetchCurrentMarketValue = async (symbol) => {
	const url = `https://financialmodelingprep.com/api/v3/quote-short/${symbol}?apikey=${process.env.FINANCIAL_MODELING_PREP_API_KEY}`;
	try {
		const response = await fetch(url, {
			method: "GET",
		});
		const data = await response.json();
		return data[0].price;
	} catch (error) {
		console.log(error.message);
		throw error;
	}
};
export default fetchCurrentMarketValue;
