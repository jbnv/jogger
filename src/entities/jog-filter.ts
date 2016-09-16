import {Jog} from './jog';

export class JogFilter {

    // a string that indicates the type of the filter
    type = null;

    // Override this function in derivatives.
    check = function(item:Jog,criteria) {
      return (item);
    }

}
