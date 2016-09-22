import {bindable} from 'aurelia-framework';
import {isAuthenticated} from '../firebase/authentication';

export class NavBar {

  @bindable router = null;

  constructor() {
  }

  get isAuthenticated() : boolean {
    return isAuthenticated();
  }
}
