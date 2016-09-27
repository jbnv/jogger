import {DecimalValueConverter} from '../../src/resources/value-converters/decimal';

var decimal = new DecimalValueConverter().toView;

describe('DecimalValueConverter', () => {
  it('(0.123,2) == 0.12', () => {
    expect(decimal(0.123,2)).toBe("0.12");
  });
});
