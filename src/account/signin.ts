import {FirebaseModule} from '../resources/firebase/index';

export class SignIn extends FirebaseModule {
  email = null;
  password = null;

  signIn() {
    this.clearState();
    this.authManager.signIn(this.email, this.password)
      .then(() => {
        this.router.navigateToRoute('jogIndex');
      })
      .catch((e) => {
        this.setStateError(e.message);
      });
  }
}
