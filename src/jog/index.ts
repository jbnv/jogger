import {computedFrom} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {FirebaseEntityModule, inject, AuthenticationManager, Router} from '../resources/firebase/index';
import {Jog} from '../entities/jog';
import {JogCollection} from '../collections/jog';
import * as moment from 'moment';

@inject(AuthenticationManager, Router, EventAggregator, JogCollection)
export class JogIndex extends FirebaseEntityModule<Jog,JogCollection> {

  collection: JogCollection;
  filters = []; // array of Filter objects
  user = null;

  constructor(
    authManager:AuthenticationManager,
    router:Router,
    eventAggregator: EventAggregator,
    collection:JogCollection
  ) {
    super(authManager,router,eventAggregator);
    this.collection = collection;
  }

  @computedFrom('collection.items', 'selectedStateFilter', 'selectedOwnerFilter')
  get filteredItems() {
    console.log("JogIndex.filteredItems");
    let items = this.collection.items;
    // this.filters.forEach(function(filter) {
    //   items = items.filter(item.check,this);
    // });
    return items;
  }
}
