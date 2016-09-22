import {EventAggregator} from 'aurelia-event-aggregator';
import {FirebaseEntityModule, inject, AuthenticationManager, Router, currentUser} from '../resources/firebase/index';
import {User} from '../entities/user';
import {UserCollection} from '../collections/user';
import config from '../config';

@inject(AuthenticationManager, Router, EventAggregator, UserCollection)
export class EditUser extends FirebaseEntityModule {

  config = config;

  constructor(
    authManager:AuthenticationManager,
    router:Router,
    eventAggregator: EventAggregator,
    collection:UserCollection
  ) {
    super(authManager,router,eventAggregator);
    this.collection = collection;
    this.itemClass = User;
    this.collectionClass = UserCollection;
    this.addTitle = "Add User";
    this.editTitle = "Edit User";
  }


}
