import BasePresenter from "./BasePresenter";
import AuthService from "../services/AuthService";
import UserModel from "../models/UserModel";

class DashboardPresenter extends BasePresenter {
  async loadProfile() {
    this.setLoading(true);
    this.setError(null);

    try {
      const response = await AuthService.getProfile();

      if (response.success && response.data.success) {
        const profileData = response.data.data;
        UserModel.setProfile(profileData);

        if (this.view && this.view.setProfileData) {
          this.view.setProfileData(profileData);
        }
      } else {
        throw new Error(response.data.message || "Gagal memuat profile");
      }
    } catch (error) {
      this.setError(error.message);
    } finally {
      this.setLoading(false);
    }
  }

  refreshProfile() {
    this.loadProfile();
  }
}

export default new DashboardPresenter();
