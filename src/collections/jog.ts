import 'moment';
import {inject, computedFrom} from 'aurelia-framework';
import {ReactiveCollection, AuthenticationManager} from '../resources/firebase/index';
import {Jog} from '../entities/jog';

@inject(AuthenticationManager)
export class JogCollection extends ReactiveCollection {
  _user = null;

  constructor(authManager:AuthenticationManager) {
    super(['jogs']);
    this._user = authManager.currentUser;
  }

  @computedFrom('items')
  get orderedItems() {
    return this.items.sort((item1, item2) => {
      if(item1.timestamp < item2.timestamp) {
        return -1;
      }
      if(item2.timestamp > item2.timestamp) {
        return 1;
      }
      return 0;
    });
  }

  add(jog:Jog) {
    if (!this._user || !this._user.isAuthenticated) {
      return Promise.reject({message: 'Authentication is required'});
    }
    if (!jog) {
      return Promise.reject({message: 'A Jog message is required'});
    }

    return super.add({
      ownerId: this._user.uid,
      ownerProfileImageUrl: this._user.profileImageUrl,
      jog: jog,
      timestamp: Math.floor(Date.now() / 1000)
    });
  }
}
