import {EventAggregator} from 'aurelia-event-aggregator';
import {FirebaseEntityModule, inject, AuthenticationManager, Router, currentUser} from '../resources/firebase/index';
import {Jog} from '../entities/jog';
import {JogCollection} from '../collections/jog';
import config from '../config';

@inject(AuthenticationManager, Router, EventAggregator, JogCollection)
export class EditJog extends FirebaseEntityModule {

  config = config;

  constructor(
    authManager:AuthenticationManager,
    router:Router,
    eventAggregator: EventAggregator,
    collection:JogCollection
  ) {
    super(authManager,router,eventAggregator);
    this.collection = collection;
    this.itemClass = Jog;
    this.addTitle = "Add Jog";
    this.editTitle = "Edit Jog";
    this.saveRoute = "jogIndex";
  }


}
