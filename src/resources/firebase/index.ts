import * as Firebase from 'firebase';
import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {EventAggregator} from 'aurelia-event-aggregator';

import {Configuration} from './configuration';
import {AuthenticationManager,currentUser,isAuthenticated} from './authentication';
import {ReactiveCollection} from './collection';

import {Entity} from '../entity';
import {State} from '../state';

export {inject} from 'aurelia-framework';
export {Router} from 'aurelia-router';
export {Configuration} from './configuration';
export {AuthenticationManager,currentUser,isAuthenticated} from './authentication';
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
      return;
    }
    this.title = this.editTitle;
    let item = this.collection.getByKey(this.parameters.id);
    this.item = new this.itemClass();
    this.item.properties.forEach((key) => {
      console.log(key,item[key]);
      this.item[key] = item[key];
    });
    return;
  }

  saveItem() {
    let key = this.parameters.id;
    console.log("saveItem",this.item,key);
    if (!this.item.isValid()) {
      console.log("Item not valid!",this.item.state);
      this.state.copy(this.item.state);
      return;
    }

    console.log("[99] Saving item.",this.item,key,this.collection);
    this.collection.add(this.item,key)
    .then(() => {
      console.log("Item saved. Rerouting.",this.saveRoute);
      this.state.setInfo("Item saved.");
      this.router.navigateToRoute(this.saveRoute);
    })
    .catch((e) => {
      this.state.setError(e.message);
    });
  }

  removeItem() {
    console.log("removeItem",this.item,this.parameters.id);
    this.collection.removeByKey(this.parameters.id)
    .then(() => {
      console.log("Item removed.");
      this.state.setInfo("Item removed.");
      this.router.navigateToRoute(this.saveRoute);
    })
    .catch((e) => {
      this.state.setError(e.message);
    });
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
    let rawItems = this.collection.items;
    let subset = [];
    for (var key in rawItems) {
      if (key[0] === "-") {
        var item = rawItems[key];
        item.key = key;
        subset.push(item);
      }
    }
    // Now items is an array, and we can sort and filter it for delivery.
    // this.filters.forEach(function(filter) {
    //   items = items.filter(item.check,this);
    // });
    return subset;
  }

}
