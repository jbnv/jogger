import {customElement} from 'aurelia-framework';
import {FirebaseModule, inject, AuthenticationManager, Router} from '../firebase/index';
import {EventAggregator} from 'aurelia-event-aggregator';
import {currentUserProperties} from '../user';

@inject(AuthenticationManager, Router,EventAggregator)
@customElement('identity')
export class Identity extends FirebaseModule {

  user = null;
  email = null;
  icon = null;

  constructor(
    authManager:AuthenticationManager,
    router:Router,
    eventAggregator: EventAggregator
  ) {
    super(authManager,router,eventAggregator);
    eventAggregator.subscribe('user-signin',(user) => {
      this.user = user;
      this.email = user.email;
      let properties = currentUserProperties();
    });
    eventAggregator.subscribe('user-properties',(properties) => {
      console.log("user-properties: properties",properties);
      console.log("user-properties: properties.icon",properties.icon);
      this.icon = properties.icon;
      console.log("user-properties: icon",this.icon);
    });
  }

  signOut() {
    this.authManager.signOut().then(() => {
      this.user = null;
      this.email = null;
      this.icon = null;
      this.router.navigateToRoute('home');
    });
  }

}
