import * as Firebase from 'firebase';
import {inject} from 'aurelia-dependency-injection';
import {EventAggregator} from 'aurelia-event-aggregator';

import {Configuration} from './configuration';

export function currentUser() : Firebase.User {
  return Firebase.auth().currentUser;
}

export function isAuthenticated() : boolean {
  return Firebase.auth().currentUser != null;
}

/**
 * Handles Firebase authentication features
 */
@inject(Configuration,EventAggregator)
export class AuthenticationManager {

  _firebase = null;
  _events = null;

  /**
   * Initializes a new instance of the AuthenticationManager
   * @param {Configuration} configuration - The configuration to use
   * @param {Publisher} publisher - The publisher used to broadcast system wide user events
   */
  constructor(configuration: Configuration, eventAggregator: EventAggregator)
  {
    this._firebase = Firebase.database().ref();
    this._events = eventAggregator;

    // Register auth state changed event.
    // This will handle user data update now and in the future.
    if (configuration.getMonitorAuthChange() === true) {
      this._firebase.onAuth((result) => {
        this._onUserAuthStateChanged(result);
      }, this);
    }
  }

  /**
   * Creates a new user but does not authenticate him.
   * @param {string} email - The user email
   * @param {string} password - The user password
   * @returns {Promise<User>} - Returns a promise which on completion will return the user infos
   */
  createUser(email, password): Firebase.Promise<any> {
    return Firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(result => {
        this._events.publish('user-created',result);
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
    return Firebase.auth().signInWithEmailAndPassword(email, password)
      .then(result => {
        this._events.publish('user-signin',result);
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
    return Firebase.auth().signOut().then(result => {
      this._events.publish('user-signout',result);
      return result;
    });
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
      this._events.publish('user-email-changed',result);
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
      this._events.publish('user-password',result);
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
      this._events.publish('user-deleted',result);
      return result;
    });
  }

  _onUserAuthStateChanged(authData) {
    this._events.publish('user-auth-changed',authData);
  }
}
