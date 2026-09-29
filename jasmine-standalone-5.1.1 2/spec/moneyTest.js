import { formatCurrency } from '../../utils/money.js';

describe('test suite: formatCurrency', () => {
  it('convert cents to dollars', () => {
    expect(formatCurrency(2095)).toEqual('20.95');
  });

  it('works with 0', () => {
    expect(formatCurrency(0)).toEqual('0.00');
  });

  it('rounds up to the nearest set', () => {
    expect(formatCurrency(200.3)).toEqual('2.00');
  })
});