'use strict';

class LoginView extends BaseView {

  constructor() {
    super();

    this.title = "TourneyMan";
    this.template = "login";
    this.container = "#login-content";

    this.model = {
      email: "",
      password: "",
    }

    this.events = {
      "click": {
        ".register_button": (el) => this.onRegisterClicked(el),
        ".submit_login": (el) => this.onLoginClicked(el)
      }
    }
  }

  pre_render() {}

  post_render() {}

  onLoginClicked(el) {
    let user = new User();

    user.authenticate(this.model.email, this.model.password)
      .then((res) => {
        console.log("User Logged In");
        window.user = user;

        router.navigate('event_list');

      }).catch((err) => {
        alert(err);
      });
  }

  onRegisterClicked(el) {
    router.navigate("register", {replace: true});
  }
}
