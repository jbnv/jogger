import * as Firebase from 'firebase';
import {Container} from 'aurelia-dependency-injection';
import {EventAggregator} from 'aurelia-event-aggregator';
import {Configuration} from './configuration';
import {noop} from '../index';

export class ReactiveCollection {

  _query = null;
  _events: EventAggregator
  items: any; // Firebase will return an object keyed to object IDs.

  constructor(path: string) {
    if (!Container || !Container.instance) throw Error('Container has not been made global');
    let config = Container.instance.get(Configuration);
    if (!config) throw Error('Configuration has not been set');
    this._events = Container.instance.get(EventAggregator);

    this._query = Firebase.database().ref(path);
    this._listenToQuery(this._query);
  }

  viewFilters = []; // array of functions on which to filter the data
  viewSortFn = (a,b) => 0; // default: do nothing

  // Returns a Promise that items will actually be available.
  waitForItems(retriesAllowed) : Firebase.Promise<any> {
    return new Firebase.Promise<any>(() => {
      var retriesMade = 0;

      var check = () => {
          if (this.items) { return this.items; }
          if (retriesMade >= retriesAllowed) { throw new Error(); }
          ++retriesMade;
          setTimeout(check, 1000);
      }

      check(); // invoke check once to start the cycle
    });
  }

  // view(): Returns items as a filtered and sorted array.
  get view() {

    let rawItems = this.items;
    let subset = [];
    for (var key in rawItems) {
      if (key !== "__firebaseKey__") {
        var item = rawItems[key];
        item.key = key;
        subset.push(item);
      }
    }

    subset = this.viewFilters.reduce((prev,fn) => prev.filter(fn), subset);
    subset.sort(this.viewSortFn);
    return subset;
  }

  add(item:any,key:string = null) : Firebase.Promise<Object> {
    if (key) {
      return this._query.child(key).set(item);
    }
    return this._query.push(item);
  }

  remove(item: any): Firebase.Promise<Object> {
    if (item === null || item.__firebaseKey__ === null) {
      return Promise.reject({message: 'Unknown item'});
    }
    return this.removeByKey(item.__firebaseKey__);
  }

  getByKey(key): any {
    if (!this.items) return null;
    return this.items[key];
  }

  removeByKey(key): Firebase.Promise<Object> {
    return this._query.child(key).remove();
  }

  clear(): Firebase.Promise<Object> {
    return this._query.remove();
  }

  _listenToQuery(query) {
    query.on('value', (snapshot) => {
      this.items = this._valueFromSnapshot(snapshot);
    });
  }

  _stopListeningToQuery(query) {
    query.off();
  }

  _valueFromSnapshot(snapshot) {
    let value = snapshot.val();
    if (!(value instanceof Object)) {
      value = {
        value: value,
        __firebasePrimitive__: true
      };
    }
    value.__firebaseKey__ = snapshot.key;
    return value;
  }

  static _getChildLocation(root: string, path: Array<string>) {
    if (!path) {
      return root;
    }
    if (!root.endsWith('/')) {
      root = root + '/';
    }

    return root  + (Array.isArray(path) ? path.join('/') : path);
  }
}
