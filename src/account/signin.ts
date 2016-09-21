import {FirebaseModule} from '../resources/firebase/index';

export class SignIn extends FirebaseModule {
  email = null;
  password = null;

  signIn() {
    console.log("SignIn.signIn",this.email, this.password);
    this.clearState();
    this.authManager.signIn(this.email, this.password)
      .then(() => {
        console.log("Signin successful.");
        this.router.navigateToRoute('jogIndex');
      })
      .catch((e) => {
        console.log("Signin failed!",e);
        this.setStateError(e.message);
      });
  }
}
