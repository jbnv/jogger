import * as Firebase from 'firebase';
import {Container} from 'aurelia-dependency-injection';
import {Configuration} from './configuration';
import {noop} from '../index';

export class ReactiveCollection {

  _query = null;
  items: any; // Firebase will return an object keyed to object IDs.

  constructor(path: string) {
    if (!Container || !Container.instance) throw Error('Container has not been made global');
    let config = Container.instance.get(Configuration);
    if (!config) throw Error('Configuration has not been set');

    this._query = Firebase.database().ref(path);
    this._listenToQuery(this._query);
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
    // query.on('child_added', (snapshot, previousKey) => {
    //   this._onItemAdded(snapshot, previousKey);
    // });
    // query.on('child_removed', (snapshot) => {
    //   this._onItemRemoved(snapshot);
    // });
    // query.on('child_changed', (snapshot, previousKey) => {
    //   this._onItemChanged(snapshot, previousKey);
    // });
    // query.on('child_moved', (snapshot, previousKey) => {
    //   this._onItemMoved(snapshot, previousKey);
    // });
  }

  _stopListeningToQuery(query) {
    query.off();
  }

  // _onItemAdded(snapshot, previousKey) {
  //   console.log("_onItemAdded",snapshot, previousKey,this.items);
  //   let value = this._valueFromSnapshot(snapshot);
  // }
  //
  // _onItemRemoved(oldSnapshot) {
  //   console.log("_onItemRemoved",oldSnapshot);
  //   let key = oldSnapshot.key;
  //   let value = this.items[key];
  //
  //   if (!value) {
  //     return;
  //   }
  //
  // }
  //
  // _onItemChanged(snapshot, previousKey) {
  //   console.log("_onItemChanged",snapshot, previousKey);
  //   let value = this._valueFromSnapshot(snapshot);
  //   let oldValue = this._valueMap.get(value.__firebaseKey__);
  //
  //   if (!oldValue) {
  //     return;
  //   }
  //
  //   this._valueMap.delete(oldValue.__firebaseKey__);
  //   this._valueMap.set(value.__firebaseKey__, value);
  // }
  //
  // _onItemMoved(snapshot, previousKey) {
  //   console.log("_onItemMoved",snapshot, previousKey);
  //   let key = snapshot.key;
  //   let value = this._valueMap.get(key);
  //
  //   if (!value) {
  //     return;
  //   }
  //
  //   this._valueMap.delete(previousKey);
  //   this._valueMap.set(value.__firebaseKey__, value);
  // }

  _valueFromSnapshot(snapshot) {
    console.log("_valueFromSnapshot",snapshot);
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
    console.log('_getChildLocation',root,path);
    if (!path) {
      return root;
    }
    if (!root.endsWith('/')) {
      root = root + '/';
    }

    return root  + (Array.isArray(path) ? path.join('/') : path);
  }
}
