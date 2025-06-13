import ApiService from "./ApiService";
import AuthModel from "../models/AuthModel";

class AuthService {
  async login(email, password) {
    const response = await ApiService.makeRequest("login", "POST", {
      email,
      password,
    });

    if (response.success && response.data.success) {
      const { data } = response.data;
      AuthModel.setAuthData({
        user: data,
        token: data.token,
      });
    }

    return response;
  }

  async register(name, email, password) {
    const response = await ApiService.makeRequest("register", "POST", {
      name,
      email,
      password,
    });

    if (response.success && response.data.success) {
      const { data } = response.data;
      AuthModel.setAuthData({
        user: data,
        token: data.token,
      });
    }

    return response;
  }

  async getProfile() {
    const { token } = AuthModel.getAuthData();

    const response = await ApiService.makeRequest(
      "profile",
      "GET",
      null,
      token
    );
    return response;
  }

  logout() {
    AuthModel.clearAuthData();
  }

  isAuthenticated() {
    const { isAuthenticated } = AuthModel.getAuthData();
    return isAuthenticated;
  }

  getCurrentUser() {
    const { user } = AuthModel.getAuthData();
    return user;
  }
}

export default new AuthService();
