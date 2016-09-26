import {Jog} from '../../src/entities/jog';
import config from '../../src/config';

function newDemoJog() {
  let demoJog = new Jog();
  demoJog.ownerId = "1";
  demoJog.date = "2015-12-12";
  demoJog.distance = 3;
  demoJog.distanceUnit = "miles"
  demoJog.time = "60";
  demoJog.timeUnit = "minutes";
  return demoJog;
}

describe('reset()', () => {
  it('clears all of the data', () => {
    var demoJog = newDemoJog();
    demoJog.reset();
    expect(demoJog.ownerId).toBe('1');
    expect(demoJog.date).toBe(null);
    expect(demoJog.distance).toBe(null);
    expect(demoJog.distanceUnit).toBe(config.defaultDistanceUnit);
    expect(demoJog.time).toBe(null);
    expect(demoJog.timeUnit).toBe(config.defaultTimeUnit);
  });
});

describe('clone()', () => {
  it('copies all of the fields', () => {
    var demoJog = newDemoJog();
    var clone = demoJog.clone();
    expect(clone.ownerId).toBe(demoJog.ownerId);
    expect(clone.date).toBe(demoJog.date);
    expect(clone.distance).toBe(demoJog.distance);
    expect(clone.distanceUnit).toBe(demoJog.distanceUnit);
    expect(clone.time).toBe(demoJog.time);
    expect(clone.timeUnit).toBe(demoJog.timeUnit);
  });
});
