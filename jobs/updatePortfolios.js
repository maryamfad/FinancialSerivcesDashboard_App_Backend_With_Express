const cron = require('node-cron');
const Portfolio = require('../models/Portfolio');
const updatePortfolioPerformance = require('./updatePortfolioPerformance');


cron.schedule('* 0 * * *', async () => { // Runs every minute
  try {
    const portfolios = await Portfolio.find();

    for (const portfolio of portfolios) {
      await updatePortfolioPerformance(portfolio._id);
    }

    console.log('All portfolios updated successfully.');
  } catch (error) {
    console.error('Failed to update portfolios:', error);
  }
});