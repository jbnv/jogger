import {bindable} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {inject} from '../firebase/index';
import {UserProperties,currentUserProperties} from '../user';

@inject(EventAggregator)
export class NavBar {

  @bindable router = null;

  showJogs = false;
  showUsers = false;

  constructor(eventAggregator) {
    eventAggregator.subscribe('user-signin',(user) => {
      let userProperties = currentUserProperties();
      this.showJogs = true;
      this.showUsers = userProperties.role == 'manager' || userProperties.role == 'admin';
    });
    eventAggregator.subscribe('user-signout',(user) => {
      this.showJogs = false;
      this.showUsers = false;
    });
  }
}
