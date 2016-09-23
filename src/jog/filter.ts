import {Container} from 'aurelia-dependency-injection';
import {EventAggregator} from 'aurelia-event-aggregator';

export class JogFilter {

  _events: EventAggregator

  filter = {
    fromDate: null,
    toDate: null,
  };

  constructor() {
    if (!Container || !Container.instance) throw Error('Container has not been made global');
    this._events = Container.instance.get(EventAggregator);
    this._events.publish('jog-filter',this.filter);
  }
}
