const config = require('../config/config');
const BaseApi = require('./baseApi');

class PaystackApi extends BaseApi {
  constructor() {
    super(config.paystackUrl);
    this.requestInit = {
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${config.paystackSecret}`,
      },
    };
  }

  // Initialize Payment Method
  async initializePayment(paymentDetails) {
     
    try {
      // Validate paymentDetails
    if (!paymentDetails.email || typeof paymentDetails.email !== 'string') {
      throw new Error("Invalid or missing 'email' in payment details");
    }
    if (!paymentDetails.amount || typeof paymentDetails.amount !== 'number') {
      throw new Error("Invalid or missing 'amount' in payment details");
    }
    if (!paymentDetails.reference || typeof paymentDetails.reference !== 'string') {
      throw new Error("Invalid or missing 'reference' in payment details");
    }
    if (!paymentDetails.subaccount || typeof paymentDetails.subaccount !== 'string') {
      throw new Error("Invalid or missing 'subaccount' in payment details for split payments");
    }

    // Prepare the request payload for Paystack
    const requestPayload = {
      email: paymentDetails.email,
      amount: paymentDetails.amount,
      reference: paymentDetails.reference,
      subaccount: paymentDetails.subaccount, // Directly using the single subaccount
      bearer: "account", // Optional: Specify who will bear transaction charges if needed
    };
    
      const response = await this.post(
        '/transaction/initialize',
        paymentDetails,
        undefined,
        this.requestInit|| {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
      );

       // Ensure response contains the authorization URL
    if (!response.data?.authorization_url) {
      throw new Error("Authorization URL not returned by Paystack");
    }

      // // Convert response keys to camelCase if needed
      // return convertObjectFromSnakeToCamelCase.snakeToCamelCase(response.data);
      // Return the response data directly without conversion
    return response.data;


    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to initialize payment';
      throw new Error(errorMessage);
    }
  }

  // Verify Payment Method
  async verifyPayment(paymentReference) {
    try {
      const response = await this.get(
        `/transaction/verify/${paymentReference}`,
        undefined,
        this.requestInit
      );

        // Log the response data for debugging purposes
    console.log("Verify Payment response:", response.data);


    // Ensure that response data has expected structure
    if (!response.data || response.data.status !== "success") {
      throw new Error("Payment verification failed or payment was not successful");
    }
      // Convert response keys to camelCase if needed
      // return convertSnakeToCamel(response.data);
      return response.data;

    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to verify payment';
      throw new Error(errorMessage);
    }
  }

    // Create Subaccount Method
    async createSubaccount(subaccountData) {
      try {
        const response = await this.post('/subaccount', subaccountData, undefined, this.requestInit);
        return response.data; // Return the created subaccount details
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to create subaccount';
        throw new Error(errorMessage);
      }
    }

  
}



// Export an instance of PaystackApi
const paystackApi = new PaystackApi();

module.exports = paystackApi;
