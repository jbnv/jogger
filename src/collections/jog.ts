import * as Firebase from 'firebase';
import 'moment';
import {inject, computedFrom} from 'aurelia-framework';
import {ReactiveCollection, AuthenticationManager, currentUser} from '../resources/firebase/index';
import {Jog} from '../entities/jog';

@inject(AuthenticationManager)
export class JogCollection extends ReactiveCollection {

  constructor(authManager:AuthenticationManager) {
    super('jogs');
  }

  add(jog:Jog,key:string = null) : Firebase.Promise<Object> {
    let user = currentUser();
    if (!user) {
      return Promise.reject({message: 'Authentication is required'});
    }
    if (!jog) {
      return Promise.reject({message: 'A Jog message is required'});
    }

    let outbound =  jog.clone();
    outbound.ownerId = outbound.ownerId || user.uid;
    outbound.timestamp = Math.floor(Date.now() / 1000);
    return super.add(outbound,key);
  }
}
