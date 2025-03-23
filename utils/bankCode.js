const axios = require('axios');


// Helper function to get bank code by bank name
async function getBankCodeByName(bankName) {
    try {
      const response = await axios.get('https://api.paystack.co/bank', {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      });
  
      const banks = response.data.data;
      const bank = banks.find(b => b.name.toLowerCase() === bankName.toLowerCase());
      
      if (!bank) throw new Error(`Bank ${bankName} not found`);
  
      return bank.code;
    } catch (error) {
      throw new Error(`Error retrieving bank code: ${error.message}`);
    }
  }
  
  module.exports = getBankCodeByName