import {FirebaseModule} from '../resources/firebase/index';

export class AccountEditPassword extends FirebaseModule {
  oldPassword = null;
  newPassword = null;
  confirmNewPassword = null;

  edit() {
    if (!this.newPassword) {
      this.setStateError('New password is required.');
      return;
    }

    if (this.newPassword !== this.confirmNewPassword) {
      this.setStateError('Password and confirmation do not match.');
      this.confirmNewPassword = null;
      return;
    }

    if (!this.oldPassword) {
      this.setStateError('Old password is required.');
      return;
    }

    this.clearState();
    this.authManager.changePassword(this.authManager.currentUser.email, this.oldPassword, this.newPassword).then(() => {
      this.setStateInfo('Password changed!');
    }, (error) => {
      this.setStateError(error.message);
    }).then(() => {
      this.oldPassword = null;
      this.newPassword = null;
      this.confirmNewPassword = null;
    });
  }
}
