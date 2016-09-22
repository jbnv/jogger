import 'moment';
import {inject, computedFrom} from 'aurelia-framework';
import {ReactiveCollection, AuthenticationManager, currentUser} from '../resources/firebase/index';
import {User} from '../entities/user';

@inject(AuthenticationManager)
export class UserCollection extends ReactiveCollection {

  constructor(authManager:AuthenticationManager) {
    super('users');
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

  add(user:User) {
    if (!currentUser()) {
      return Promise.reject({message: 'Authentication is required'});
    }
    if (!user) {
      return Promise.reject({message: 'A User message is required'});
    }

    let outbound =  user.clone();
    outbound.timestamp = Math.floor(Date.now() / 1000);
    return super.add(outbound,user.ownerId);
  }
}
