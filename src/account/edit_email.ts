import {FirebaseModule} from '../resources/firebase/index';

export class AccountEditEmail extends FirebaseModule {
  newEmail = null;
  password = null;

  edit() {
    if (!this.newEmail) {
      this.setStateError('New email address is required.');
      return;
    }
    if (!this.password) {
      this.setStateError('Password is required to change email.');
      return;
    }

    this.clearState();
    this.authManager.changeEmail(this.authManager.currentUser.email, this.password, this.newEmail).then(() => {
      this.authManager.currentUser.email = this.newEmail;
      this.setStateInfo('Email changed.');
    }, (error) => {
      this.setStateError(error.message);
    }).then(() => {
      this.newEmail = null;
      this.password = null;
    });
  }
}
