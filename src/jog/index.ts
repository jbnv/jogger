import {computedFrom} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {FirebaseCollectionModule, inject, AuthenticationManager, Router} from '../resources/firebase/index';
import {Jog} from '../entities/jog';
import {JogCollection} from '../collections/jog';
import * as moment from 'moment';
import {sortByDate} from '../transform';

@inject(AuthenticationManager, Router, EventAggregator, JogCollection)
export class JogIndex extends FirebaseCollectionModule {

  collection: JogCollection;
  _events: EventAggregator;
  user = null;

  fromDateFilterFn = (item) => !this.filterContext.fromDate || item.date >= this.filterContext.fromDate;
  toDateFilterFn = (item) => !this.filterContext.toDate || item.date <= this.filterContext.toDate;

  showFilters = false;
  toggleFilters() {
    this.showFilters = !this.showFilters;
    if (!this.showFilters) {
      this.filterContext.fromDate = null;
      this.filterContext.toDate = null;
    }
  }

  filterContext = {
    fromDate: null,
    toDate: null
  }

  regenerate() {
    console.log("JogIndex.regenerate");
    this.collection.viewFilters = [this.fromDateFilterFn,this.toDateFilterFn];
    this.collection.viewSortFn = sortByDate;
  }

  constructor(
    authManager:AuthenticationManager,
    router:Router,
    eventAggregator: EventAggregator,
    collection:JogCollection
  ) {
    super(authManager,router,eventAggregator);
    this.collection = collection;
    this._events = eventAggregator;
    this.regenerate();

    this._events.subscribe('jog-filter',(filter) => {
      this.filterContext = filter;
      this.regenerate();
    });
  }

  //@computedFrom('collection.items', 'selectedStateFilter', 'selectedOwnerFilter')
  //get filteredItems() {
}
