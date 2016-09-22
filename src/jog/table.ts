import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';

import {ReactiveCollection} from '../resources/firebase/collection';

@inject(Router)
export class JogTable {
  content: any;
  router = null;

  constructor(router) {
    this.router = router;
  }

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

  edit(key) {
    this.router.navigateToRoute('jogEdit',{id:key});
  }
}
