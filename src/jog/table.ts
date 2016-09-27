import {Container} from 'aurelia-dependency-injection';
import {Router} from 'aurelia-router';
import {EventAggregator} from 'aurelia-event-aggregator';

import {ReactiveCollection} from '../resources/firebase/collection';

export class JogTable {
  content: any;
  _events: EventAggregator;
  _router: Router;

  constructor(router) {
    if (!Container || !Container.instance) throw Error('Container has not been made global');
    this._router = Container.instance.get(Router);
  }

  activate(data) {
    this.content = data.items;
  }

  edit(key) {
    this._router.navigateToRoute('jogEdit',{id:key});
  }
}
