import {computedFrom} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {FirebaseCollectionModule, inject, AuthenticationManager, Router} from '../resources/firebase/index';
import {User} from '../entities/user';
import {UserCollection} from '../collections/user';
import * as moment from 'moment';

@inject(AuthenticationManager, Router, EventAggregator, UserCollection)
export class UserIndex extends FirebaseCollectionModule {

  collection: UserCollection;
  filters = []; // array of Filter objects
  user = null;

  constructor(
    authManager:AuthenticationManager,
    router:Router,
    eventAggregator: EventAggregator,
    collection:UserCollection
  ) {
    super(authManager,router,eventAggregator);
    this.collection = collection;
  }
}
