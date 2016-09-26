import * as transform from '../../src/transform';

describe('sortByDate', () => {
  it('sorts an array of objects by the \'date\' field', () => {
    let dataset = [
      {date:'2001-01-01'},
      {date:'2016-09-25'},
      {date:'1975-12-12'}
    ].sort(transform.sortByDate);
    expect(dataset[0].date).toBe('1975-12-12');
    expect(dataset[1].date).toBe('2001-01-01');
    expect(dataset[2].date).toBe('2016-09-25');
  });
});
