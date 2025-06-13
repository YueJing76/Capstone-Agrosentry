import BasePresenter from "./BasePresenter";
import AuthService from "../services/AuthService";

class AuthPresenter extends BasePresenter {
  async handleLogin(formData) {
    this.setLoading(true);
    this.setError(null);

    try {
      const { email, password } = formData;

      // Validasi
      if (!email || !password) {
        throw new Error("Email dan password harus diisi");
      }

      const response = await AuthService.login(email, password);

      if (response.success && response.data.success) {
        this.showSuccess("Login berhasil!");

        // Redirect ke home
        if (this.view && this.view.onLoginSuccess) {
          this.view.onLoginSuccess(response.data.data);
        }
      } else {
        throw new Error(response.data.message || "Login gagal");
      }
    } catch (error) {
      this.setError(error.message);
    } finally {
      this.setLoading(false);
    }
  }

  async handleRegister(formData) {
    this.setLoading(true);
    this.setError(null);

    try {
      const { name, email, password, confirmPassword } = formData;

      // Validasi
      if (!name || !email || !password) {
        throw new Error("Semua field harus diisi");
      }

      if (password !== confirmPassword) {
        throw new Error("Password tidak cocok");
      }

      if (password.length < 6) {
        throw new Error("Password minimal 6 karakter");
      }

      const response = await AuthService.register(name, email, password);

      if (response.success && response.data.success) {
        this.showSuccess("Register berhasil!");

        // Redirect ke dashboard
        if (this.view && this.view.onRegisterSuccess) {
          this.view.onRegisterSuccess(response.data.data);
        }
      } else {
        throw new Error(response.data.message || "Register gagal");
      }
    } catch (error) {
      this.setError(error.message);
    } finally {
      this.setLoading(false);
    }
  }

  handleLogout() {
    AuthService.logout();
    if (this.view && this.view.onLogoutSuccess) {
      this.view.onLogoutSuccess();
    }
  }
}

export default new AuthPresenter();