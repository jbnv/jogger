import * as Firebase from 'firebase';
import {inject} from 'aurelia-dependency-injection';

import * as events from './events';
import {User} from './user';
import {Configuration} from './configuration';

/**
 * Handles Firebase authentication features
 */
@inject(Configuration, events.Publisher)
export class AuthenticationManager {

  _firebase = null;
  _publisher = null;

  /**
   * Initializes a new instance of the AuthenticationManager
   * @param {Configuration} configuration - The configuration to use
   * @param {Publisher} publisher - The publisher used to broadcast system wide user events
   */
  constructor(
    configuration: Configuration,
    publisher: events.Publisher)
  {
    console.log("AuthenticationManager.constructor");
    this._firebase = Firebase.database().ref();
    this._publisher = publisher;

    // Register auth state changed event.
    // This will handle user data update now and in the future.
    if (configuration.getMonitorAuthChange() === true) {
      this._firebase.onAuth((result) => {
        this._onUserAuthStateChanged(result);
      }, this);
    }
  }

  currentUser() {
    return Firebase.auth().currentUser;
  }

  /**
   * Creates a new user but does not authenticate him.
   * @param {string} email - The user email
   * @param {string} password - The user password
   * @returns {Promise<User>} - Returns a promise which on completion will return the user infos
   */
  createUser(email, password): Firebase.Promise<any> {
    console.log("AuthenticationManager.createUser");
    return Firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(result => {
        this._publisher.publish(new events.UserCreatedEvent(result));
        return Firebase.auth().currentUser;
      })
  }

  /**
   * Sign in a user with a password.
   * @param {string} email - The user email
   * @param {string} password - The user password
   * @returns {Promise<User>} Returns a promise which on completion will return user infos
   */
  signIn(email, password): Firebase.Promise<any> {
    console.log("AuthenticationManager.signIn");
    return Firebase.auth().signInWithEmailAndPassword(email, password)
      .then(result => {
        this._publisher.publish(new events.UserSignedInEvent(result));
        return Firebase.auth().currentUser;
      });
  }

  /**
   * Creates a user and automatically sign in if creation succeed
   * @param {string} email - The user email
   * @param {string} password - The user password
   * @returns {Promise<User>} - Returns a promise which on completion will return user infos
   */
  createUserAndSignIn(email, password): Firebase.Promise<any> {
    return this.createUser(email, password).then(() => {
      return this.signIn(email, password);
    });
  }

  /**
   * Sign out any authenticated user
   * @returns {Promise} - Returns a promise
   */
  signOut(): Firebase.Promise<any> {
    console.log("AuthenticationManager.signOut");
    return Firebase.auth().signOut();
  }

  /**
   * Changes the user email.
   * User will be disconnected upon email change.
   * @param {string} oldEmail - The current user email (email to be changed)
   * @param {string} password - The current user password
   * @param {string} newEmail - The new email
   * @returns {Promise} - Returns a promise which on completion will return an object containing the old and new email
   */
  changeEmail(oldEmail, password, newEmail): Firebase.Promise<any> {
    var user = Firebase.auth().currentUser;
    return user.updateEmail(newEmail).then(function() {
      let result = { oldEmail: oldEmail, newEmail: newEmail };
      this._publisher.publish(new events.UserEmailChangedEvent(result));
      return result;
    });
  }

  /**
   * Changes the user password
   * @param {string} email - The email of the user to change the password
   * @param {string} oldPassword - The current password
   * @param {string} newPassword - The new password
   */
  changePassword(email, oldPassword, newPassword): Firebase.Promise<any> {
    var user = Firebase.auth().currentUser;
    return user.updatePassword(newPassword).then(function() {
      let result = { oldPassword: oldPassword, newPassword: newPassword };
      this._publisher.publish(new events.UserPasswordChangedEvent(result));
      return result;
    });
  }

  /**
   * Deletes a user account
   * @param {string} email - The users's email
   * @param {string} password - The user's password
   */
  deleteUser(email: string, password: string): Firebase.Promise<any> {
    var user = Firebase.auth().currentUser;
    return user.delete().then(function() {
      let result = { email: email };
      this._publisher.publish(new events.UserDeletedEvent(result));
      return result;
    });
  }

  _onUserAuthStateChanged(authData) {
    this._publisher.publish(new events.UserAuthStateChangedEvent(authData));
  }
}
