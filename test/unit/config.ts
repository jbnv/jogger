import config from '../../src/config';

describe('config', () => {
  it('has a \'loginRoute\' field', () => {
    expect(config.loginRoute).not.toBe(null);
  });
  it('has a \'defaultDistanceUnit\' field', () => {
    expect(config.defaultDistanceUnit).not.toBe(null);
  });
  it('has a \'defaultTimeUnit\' field', () => {
    expect(config.defaultTimeUnit).not.toBe(null);
  });
});
