import {User} from '../../src/entities/user';
import config from '../../src/config';

function newDemoUser() {
  let demoUser = new User();
  demoUser.ownerId = "1";
  demoUser.role = "admin";
  return demoUser;
}

describe('reset()', () => {
  it('clears all of the data', () => {
    var demoUser = newDemoUser();
    demoUser.reset();
    expect(demoUser.ownerId).toBe(null);
    expect(demoUser.role).toBe(null);
  });
});

describe('clone()', () => {
  it('copies all of the fields', () => {
    var demoUser = newDemoUser();
    var clone = demoUser.clone();
    expect(clone.ownerId).toBe(demoUser.ownerId);
    expect(clone.role).toBe(demoUser.role);
  });
});
