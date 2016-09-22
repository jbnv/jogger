import {Entity} from '../resources/entity'
import config from '../config';

export class User extends Entity {
  ownerId = null;
  role = null;

  properties = ['ownerId','role'];

  reset() {
    this.ownerId = null;
    this.role = null;
  }

  validators = [
  ];

}
