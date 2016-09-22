// Entity: An object that represents something, has state, and has validity.

import * as moment from 'moment';
import {State} from './state';

export class Entity {
  id: any;
  ownerId: any;
  state: State;

  constructor() {
    this.state = new State();
  }

  // validators: [{match function,message}]
  validators = [];

  isValid() {
    this.state.clear();
    let _self = this;
    let error = this.validators.reduce(
      (msg,validator) => { if (!validator.fn(_self)) msg += validator.message; return msg; },
      ""
    );
    if (error.length > 0) {
      this.state.setError(error);
      return false;
    }
    return true;
  }

  properties = [];

  clone() {
    let _me = this;
    return _me.properties.reduce((p,c) => {
      p[c] = _me[c]; return p;
    },{});
  }

}
