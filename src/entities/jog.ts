import {Entity} from '../resources/entity'
import config from '../config';

export class Jog extends Entity {
  ownerId = null;
  date = null; // Date that the jog took place.
  distance = null; // number indicating the distance
  distanceUnit = config.defaultDistanceUnit;
  time = null; // time elapsed for the run
  timeUnit = config.defaultTimeUnit;

  properties = ['ownerId','date','distance','distanceUnit','time','timeUnit'];

  reset() {
    this.date = null;
    this.distance = null;
    this.distanceUnit = config.defaultDistanceUnit;
    this.time = null;
    this.timeUnit = config.defaultTimeUnit;
  }

  validators = [
    {
      fn: item => (item.date && Date.parse(item.date) < Date.now()),
      message: 'Date is required and must be prior to now.'
    },
    {
      fn: item => (item.distance && item.distance > 0),
      message: 'Distance is required and must be greater than 0.'
    },
    {
      fn: item => (item.time && item.time > 0),
      message: 'Time is required and must be greater than 0.'
    }
  ];


}
