import * as Firebase from 'firebase';
import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {EventAggregator} from 'aurelia-event-aggregator';

import {Configuration} from './configuration';
import {AuthenticationManager,currentUser} from './authentication';
import {ReactiveCollection} from './collection';

import {Entity} from '../entity';
import {State} from '../state';

export {inject} from 'aurelia-framework';
export {Router} from 'aurelia-router';
export {Configuration} from './configuration';
export {AuthenticationManager, currentUser} from './authentication';
export {ReactiveCollection} from './collection';

export function configure(aurelia: any, configCallback: Function) {
  let config = new Configuration();

  if (configCallback !== undefined && typeof configCallback === 'function') {
    configCallback(config);
  }
  aurelia.instance(Configuration, config);
}

@inject(AuthenticationManager, Router, EventAggregator)
export class FirebaseModule {
  authManager = null;
  router = null;
  eventAggregator = null;
  user = null;
  state: State;
  parameters: any;
  title: string;

  constructor(authManager:AuthenticationManager, router:Router, eventAggregator: EventAggregator) {
    this.authManager = authManager;
    this.router = router;
    this.eventAggregator = eventAggregator;
    this.user = currentUser();
    this.state = new State();
  }

  clearState = () => { this.state.clear(); }
  setStateInfo = (message) => { this.state.setInfo(message); }
  setStateError = (message) => { this.state.setError(message); }

}

export class FirebaseEntityModule extends FirebaseModule {
  item: Entity;
  itemClass: any;
  collection: ReactiveCollection; // collection class that handles E
  collectionClass: any;
  addTitle = "";
  editTitle = "";
  saveRoute = "";

  setEntityClass(c) {
    this.itemClass = c;
  }

  setCollectionClass(c) {
    this.collectionClass = c;
  }

  reset() {
    this.item = null;
  }

  refresh() {
    if (!this.parameters.id) {
      this.item = new this.itemClass();
      this.item.ownerId = this.user.uid;
      this.title = this.addTitle;
      console.log(this.item);
      return;
    }
    this.title = this.editTitle;
    //TODO Implement loading an existing item.
    return;
  }

  saveItem() {
    console.log("saveItem",this.item);
    if (!this.item.isValid()) {
      console.log("Item not valid!",this.item.state);
      this.state.copy(this.item.state);
      return;
    }

    // if (this.item.id) {
    //   // this.collection.update(this.item).then(() => {
    //   //   this.state.clear();
    //   // })
    //   // .catch((e) => {
    //   //   this.state.setError(e.message);
    //   // });
    // } else {
      console.log("Saving item.");
      // this.item.generateId();
      this.collection.add(this.item)
      .then(() => {
        console.log("Item saved.");
        this.state.setInfo("Item saved.");
        this.router.navigateToRoute('jogIndex');
      })
      .catch((e) => {
        this.state.setError(e.message);
      });
    // }
  }

  removeItem() {
//INCOMPLETE
  }

  activate(parameters,routeConfig) {
    console.log("activate",parameters,routeConfig);
    this.parameters = parameters;
    //this.navModel = routeConfig.navModel;
    return this.refresh();
  }
}

export class FirebaseCollectionModule extends FirebaseModule {
  collection: ReactiveCollection; // collection class that handles E
  collectionClass: any;

  // overrideable
  refresh() {
    return;
  }

  activate(parameters,routeConfig) {
    console.log("activate",parameters,routeConfig);
    this.parameters = parameters;
    //this.navModel = routeConfig.navModel;
    return this.refresh();
  }

  // returns items as a filtered and sorted array
  get items() {
    //console.log("JogIndex.items");
    let rawItems = this.collection.items;
    let subset = Object.keys(rawItems).map(key => rawItems[key]);
    // Now items is an array, and we can sort and filter it for delivery.
    // this.filters.forEach(function(filter) {
    //   items = items.filter(item.check,this);
    // });
    return subset;
  }

}
