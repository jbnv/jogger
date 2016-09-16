import {Configuration} from './configuration';

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
