class AuthModel {
  constructor() {
    this.user = null;
    this.token = null;
    this.isAuthenticated = false;
  }

  setAuthData({ user, token }) {
    this.user = user;
    this.token = token;
    this.isAuthenticated = true;

    // Store in localStorage
    localStorage.setItem("authToken", token);
    localStorage.setItem("userData", JSON.stringify(user));
  }

  getAuthData() {
    if (!this.isAuthenticated) {
      const token = localStorage.getItem("authToken");
      const userData = localStorage.getItem("userData");

      if (token && userData) {
        this.token = token;
        this.user = JSON.parse(userData);
        this.isAuthenticated = true;
      }
    }

    return {
      user: this.user,
      token: this.token,
      isAuthenticated: this.isAuthenticated,
    };
  }

  clearAuthData() {
    this.user = null;
    this.token = null;
    this.isAuthenticated = false;

    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
  }

  updateUser(userData) {
    this.user = { ...this.user, ...userData };
    localStorage.setItem("userData", JSON.stringify(this.user));
  }
}

export default new AuthModel();
