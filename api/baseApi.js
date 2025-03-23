const axios = require('axios');

class BaseApi {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async request(url, data, args = {}, config = {}) {
    try {
      // Construct the full URL using the base URL
      const urlObj = new URL(url, this.baseUrl);

      // Append query parameters if provided
      Object.keys(args).forEach((key) => 
        urlObj.searchParams.append(key, args[key])
      );

      // Set up the request options with Axios
      const requestOptions = {
        ...config,
        url: urlObj.toString(),
        data,
      };

      // Perform the request with Axios and return the response data
      const response = await axios(requestOptions);
      return response.data;
    } catch (error) {
      // Handle errors by extracting the message from the Axios error response
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(errorMessage || 'Request failed');
    }
  }

  // Helper method for GET requests
  get(url, args, config = {}) {
    return this.request(url, undefined, args, { ...config, method: 'GET' });
  }

  // Helper method for POST requests
  post(url, body, args, config = {}) {
    return this.request(url, body, args, { ...config, method: 'POST' });
  }
}

module.exports = BaseApi;
