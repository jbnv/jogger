import {FirebaseModule,currentUser} from '../resources/firebase/index';

export class Account extends FirebaseModule {

  email = null;

  activate() {
    this.email = currentUser().email;
  }

}
