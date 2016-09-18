import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {Configuration} from './configuration';
import {AuthenticationManager} from './authentication';

export {User} from './user';
export {Configuration} from './configuration';
export {AuthenticationManager} from './authentication';
export {ReactiveCollection} from './collection';
export * from './events';

export function configure(aurelia: any, configCallback: Function) {
  let config = new Configuration();

  if (configCallback !== undefined && typeof configCallback === 'function') {
    configCallback(config);
  }
  aurelia.instance(Configuration, config);
}

@inject(AuthenticationManager, Router)
export class FirebaseModule {
  authManager = null;
  router = null;
  message = null;
  state = null;

  constructor(authManager:AuthenticationManager, router:Router) {
    this.authManager = authManager;
    this.router = router;
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
