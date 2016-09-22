import {bindable} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {inject} from '../firebase/index';

@inject(EventAggregator)
export class NavBar {

  @bindable router = null;
  isAuthenticated = false;

  constructor(eventAggregator) {
    eventAggregator.subscribe('user-signin',(user) => {
      this.isAuthenticated = true;
    });
    eventAggregator.subscribe('user-signout',(user) => {
      this.isAuthenticated = false;
    });
  }
}
