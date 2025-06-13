class ApiModel {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_BASE_URL;
    this.endpoints = {
      login: "/auth/login",
      register: "/auth/register",
      profile: "/auth/profile",
    };
  }

  getEndpoint(name) {
    return `${this.baseURL}${this.endpoints[name]}`;
  }

  createRequestConfig(method, data = null, token = null) {
    const config = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (data) {
      config.body = JSON.stringify(data);
    }

    return config;
  }
}

export default new ApiModel();
