import {FirebaseModule} from '../resources/firebase/index';

export class SignUp extends FirebaseModule {
  email = null;
  password = null;

  signUp() {
    console.log("SignUp.signUp");
    this.clearState();
    this.authManager.createUserAndSignIn(this.email, this.password)
      .then(() => {
        this.router.navigateToRoute('accountIndex');
      })
      .catch((e) => {
        this.setStateError(e.message);
      });
  }
}
