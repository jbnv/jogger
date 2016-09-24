import {customElement} from 'aurelia-framework';
import {FirebaseModule, inject, AuthenticationManager, Router} from '../firebase/index';
import {EventAggregator} from 'aurelia-event-aggregator';
import {currentUserProperties} from '../user';

@inject(AuthenticationManager, Router,EventAggregator)
@customElement('identity')
export class Identity extends FirebaseModule {

  user = null;
  email = null;
  properties = {};

  reset() {
    this.user = null;
    this.email = null;
    this.properties = {};
  }

  constructor(
    authManager:AuthenticationManager,
    router:Router,
    eventAggregator: EventAggregator
  ) {
    super(authManager,router,eventAggregator);
    this.reset();
    eventAggregator.subscribe('user-signin',(user) => {
      this.user = user;
      this.email = user.email;
      this.properties = currentUserProperties();
    });
  }

  signOut() {
    this.authManager.signOut().then(() => {
      this.reset();
      this.router.navigateToRoute('home');
    });
  }

}
