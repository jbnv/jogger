import * as Firebase from 'firebase';
import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {EventAggregator} from 'aurelia-event-aggregator';
import {Configuration} from './configuration';
import {AuthenticationManager} from './authentication';

export {inject} from 'aurelia-framework';
export {Router} from 'aurelia-router';
export {Configuration} from './configuration';
export {AuthenticationManager, currentUser} from './authentication';
export {ReactiveCollection} from './collection';

export function configure(aurelia: any, configCallback: Function) {
  let config = new Configuration();

  if (configCallback !== undefined && typeof configCallback === 'function') {
    configCallback(config);
  }
  aurelia.instance(Configuration, config);
}

@inject(AuthenticationManager, Router, EventAggregator)
export class FirebaseModule {
  authManager = null;
  router = null;
  eventAggregator = null;
  message = null;
  state = null;

  constructor(authManager:AuthenticationManager, router:Router, eventAggregator: EventAggregator) {
    this.authManager = authManager;
    this.router = router;
    this.eventAggregator = eventAggregator;
  }

  clearState = () => {
    this.state = null;
    this.message = null;
  }

  setStateInfo = (message) => {
    this.state = 'info';
    this.message = message;
  }

  setStateError = (message) => {
    this.state = 'error';
    this.message = message;
  }
}

export class FirebaseEntityModule<T> extends FirebaseModule {
  item: T;

  reset() {
    this.item = null;
  }
}
