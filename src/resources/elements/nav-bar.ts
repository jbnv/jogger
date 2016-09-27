import {bindable} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {inject} from '../firebase/index';
import {UserProperties,currentUserProperties} from '../user';

@inject(EventAggregator)
export class NavBar {

  @bindable router = null;

  properties: UserProperties;

  constructor(eventAggregator) {
    eventAggregator.subscribe('user-signin',(user) => {
      this.properties = currentUserProperties();
    });
    eventAggregator.subscribe('user-signout',(user) => {
      this.properties = null;
    });
  }
}
