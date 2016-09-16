export class Jog {
  ownerId = null;
  date = null; // Date that the jog took place.
  distance = null; // number indicating the distance
  distanceUnits = "mile";
  time = null; // time elapsed for the run
  timeUnits = "minute";

  reset() {
    this.date = null;
    this.distance = null;
    this.distanceUnits = "mile";
    this.time = null;
    this.timeUnits = "minute";
  }
}
