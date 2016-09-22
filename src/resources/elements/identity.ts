import {customElement} from 'aurelia-framework';
import {FirebaseModule, inject, AuthenticationManager, Router} from '../firebase/index';
import {EventAggregator} from 'aurelia-event-aggregator';

@inject(AuthenticationManager, Router,EventAggregator)
@customElement('identity')
export class Identity extends FirebaseModule {

  user = null;
  email = null;

  constructor(
    authManager:AuthenticationManager,
    router:Router,
    eventAggregator: EventAggregator
  ) {
    super(authManager,router,eventAggregator);
    eventAggregator.subscribe('user-signin',(user) => {
      this.user = user;
      this.email = user.email;
    });
  }

  signOut() {
    this.authManager.signOut().then(() => {
      this.user = null;
      this.email = null;
      this.router.navigateToRoute('home');
    });
  }

}
