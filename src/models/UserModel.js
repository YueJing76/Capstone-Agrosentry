class UserModel {
  constructor() {
    this.profile = null;
  }

  setProfile(profileData) {
    this.profile = {
      id: profileData.id,
      name: profileData.name,
      email: profileData.email,
      createdAt: profileData.createdAt,
    };
  }

  getProfile() {
    return this.profile;
  }

  clearProfile() {
    this.profile = null;
  }

  updateProfile(updates) {
    if (this.profile) {
      this.profile = { ...this.profile, ...updates };
    }
  }
}

export default new UserModel();
