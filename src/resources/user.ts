import * as Firebase from 'firebase';
import {ReactiveCollection} from './firebase/index';

export class UserProperties extends ReactiveCollection {

  uid = null;

  get role() {
    return (this.items || {}).role;
  }

  get icon() {
    let role = this.role;
    if (role == 'admin') return 'star';
    if (role == 'manager') return 'star-half-o';
    return null;
  }

  constructor(uid) {
    super(`users/${uid}`);
    this.uid = uid;
    this._events.publish('user-properties',this);
  }
}

export function currentUserProperties() : UserProperties {
  let user = Firebase.auth().currentUser;
  if (!user) return null;
  return new UserProperties(user.uid);
}
