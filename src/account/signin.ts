import * as Firebase from 'firebase';
import {FirebaseModule,ReactiveCollection} from '../resources/firebase/index';

export class SignIn extends FirebaseModule {
  email = null;
  password = null;

  signIn() {
    this.clearState();
    this.authManager.signIn(this.email, this.password)
    .then((fbUser) => {
      //++ This is ugly and should be encapsulated.
      Firebase.database().ref(`users/${fbUser.uid}/role`).once('value')
      .then((snapshot) => {
        if (snapshot.val() == "disabled") {
          throw new Error("Your account is disabled.");
        }
        this.router.navigateToRoute('jogIndex');
        return true;
      })
      .catch((e) => {
        this.setStateError(e.message || "Unable to verify user account.");
        this.authManager.signOut();
      });
    })
    .catch((e) => {
      this.setStateError(e.message || "Unable to verify user account.");
      this.authManager.signOut();
    });
  }
}
