import 'moment';
import {inject, computedFrom} from 'aurelia-framework';
import {ReactiveCollection, AuthenticationManager, currentUser} from '../resources/firebase/index';
import {User} from '../entities/user';

@inject(AuthenticationManager)
export class UserCollection extends ReactiveCollection {

  constructor(authManager:AuthenticationManager) {
    super('users');
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
