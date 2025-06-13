import ApiModel from "../models/ApiModel";

class ApiService {
  async makeRequest(endpoint, method = "GET", data = null, token = null) {
    try {
      const url = ApiModel.getEndpoint(endpoint);
      const config = ApiModel.createRequestConfig(method, data, token);

      const response = await fetch(url, config);
      const result = await response.json();

      return {
        success: response.ok,
        status: response.status,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        status: 500,
        data: { message: "Network error occurred" },
      };
    }
  }
}

export default new ApiService();
