//import {ReactiveCollection} from '../resources/firebase/collection';

export class JogTable {
  content: any;

  bind(bindingContext, overrideContext) {
  }

  activate(data) {

    console.log("JogTable.activate",data);
    this.content = data.items;

    // this.aggregate();
    //
    // if (data.showOnly) {
    //   Columns.prototype.showOnly.apply(this.columns,data.showOnly);
    // } else if (data.hide) {
    //   Columns.prototype.hide.apply(this.columns,data.hide);
    // }
    //
    // this.sort('songAdjustedAverage');

  }
}
