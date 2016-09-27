import {computedFrom} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {FirebaseCollectionModule, inject, AuthenticationManager, Router, currentUser} from '../resources/firebase/index';
import {Jog} from '../entities/jog';
import {JogCollection} from '../collections/jog';
import * as moment from 'moment';
import {sortByDate} from '../transform';

@inject(AuthenticationManager, Router, EventAggregator, JogCollection)
export class JogWeekly extends FirebaseCollectionModule {

  collection: JogCollection;
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
    let uid = currentUser().uid;

    // Reduce and group by weeks.
    let refMoment = moment('2000-01-01');
    let reducedData = {};
    for (var key in this.collection.items) {
      if (key == '__firebaseKey__') continue;
      let item = this.collection.items[key];
      if (item.ownerId !== uid) continue;
      let currentMoment = moment(item.date);
      let week = currentMoment.diff(refMoment,'weeks');
      if (!reducedData[week]) {
        reducedData[week] = {
          startDate: refMoment.clone().add(week,'weeks').format(this.dateFormat),
          endDate: refMoment.clone().add(week,'weeks').add(6,'days').format(this.dateFormat),
          jogs: 0,
          totalDistance: 0.0,
          totalTime: 0.0
        };
      }
      //WARNING: Does not yet account for possible differences in units of measure!
      reducedData[week].jogs++;
      reducedData[week].totalDistance += parseFloat(item.distance);
      reducedData[week].totalTime += parseFloat(item.time);
    }

    Object.keys(reducedData).sort().forEach(key => {
      this.reducedDataAsArray.push(reducedData[key]);
    });
  }

}
