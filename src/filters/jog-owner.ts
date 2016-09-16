import {Jog} from '../entities/jog';
import {JogFilter} from '../entities/jog-filter';

export class JogOwnerFilter extends JogFilter {

  constructor() {
    super();
    this.type = "owner";
    // this.check = function(item:Jog,criteria) {
    //   return item && item.ownerId == criteria;
    // }
  }
}
