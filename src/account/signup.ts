import * as Firebase from 'firebase';
import {FirebaseModule} from '../resources/firebase/index';
import {User} from '../entities/user';

export class SignUp extends FirebaseModule {
  email = null;
  password = null;

  signUp() {
    console.log("SignUp.signUp");
    this.clearState();
    this.authManager.createUserAndSignIn(this.email, this.password)
      .then((fbUser) => {
        //Create user properties.
        let user = new User();
        user.ownerId = fbUser.uid;
        user.role = 'user';
        //++ This is ugly and should be encapsulated.
        Firebase.database().ref(`users/${user.ownerId}`).set(user.clone());
        this.router.navigateToRoute('accountIndex');
      })
      .catch((e) => {
        this.setStateError(e.message);
      });
  }
}
