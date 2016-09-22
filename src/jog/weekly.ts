import {computedFrom} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {FirebaseCollectionModule, inject, AuthenticationManager, Router} from '../resources/firebase/index';
import {Jog} from '../entities/jog';
import {JogCollection} from '../collections/jog';
import * as moment from 'moment';
import {sortByDate} from '../transform';

@inject(AuthenticationManager, Router, EventAggregator, JogCollection)
export class JogWeekly extends FirebaseCollectionModule {

  collection: JogCollection;
  reducedData = {};
  reducedDataAsArray = [];
  user = null;
  dateFormat = 'YYYY-MM-DD';

  constructor(
    authManager:AuthenticationManager,
    router:Router,
    eventAggregator: EventAggregator,
    collection:JogCollection
  ) {
    super(authManager,router,eventAggregator);
    this.collection = collection;
    this.sortFn = sortByDate;

    // Reduce and group by weeks.
    let refMoment = moment('2000-01-01');
    for (var key in this.collection.items) {
      let item = this.collection.items[key];
      let currentMoment = moment(item.date);
      let week = currentMoment.diff(refMoment,'weeks');
      if (!this.reducedData[week]) {
        this.reducedData[week] = {
          startDate: refMoment.clone().add(week,'weeks').format(this.dateFormat),
          endDate: refMoment.clone().add(week,'weeks').add(6,'days').format(this.dateFormat),
          jogs: 0,
          totalDistance: 0.0,
          totalTime: 0.0
        };
        //WARNING: Does not yet account for possible differences in units of measure!
        this.reducedData[week].jogs++;
        this.reducedData[week].totalDistance += parseFloat(item.distance);
        this.reducedData[week].totalTime += parseFloat(item.time);
      }
    }

    Object.keys(this.reducedData).sort().forEach(key => {
      this.reducedDataAsArray.push(this.reducedData[key]);
    });
  }

}
