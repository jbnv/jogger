import 'moment';
import {inject, computedFrom} from 'aurelia-framework';
import {ReactiveCollection, AuthenticationManager, currentUser} from '../resources/firebase/index';
import {Jog} from '../entities/jog';

@inject(AuthenticationManager)
export class JogCollection extends ReactiveCollection {

  constructor(authManager:AuthenticationManager) {
    super('jogs');
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
    let user = currentUser();
    if (!user) {
      return Promise.reject({message: 'Authentication is required'});
    }
    if (!jog) {
      return Promise.reject({message: 'A Jog message is required'});
    }

    let outbound =  jog.clone();
    outbound.ownerId = user.uid;
    outbound.timestamp = Math.floor(Date.now() / 1000);
    return super.add(outbound);
  }
}
