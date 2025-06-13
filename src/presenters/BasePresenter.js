class BasePresenter {
  constructor() {
    this.view = null;
    this.loading = false;
    this.error = null;
  }

  setView(view) {
    this.view = view;
  }

  setLoading(loading) {
    this.loading = loading;
    if (this.view && this.view.setLoading) {
      this.view.setLoading(loading);
    }
  }

  setError(error) {
    this.error = error;
    if (this.view && this.view.setError) {
      this.view.setError(error);
    }
  }

  showSuccess(message) {
    if (this.view && this.view.showSuccess) {
      this.view.showSuccess(message);
    }
  }
}

export default BasePresenter;
