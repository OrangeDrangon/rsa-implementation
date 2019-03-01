import { BigNumber } from 'bignumber.js';

export class Utils {
  public static powMod(a: BigNumber, b: BigNumber, c: BigNumber): BigNumber {
    const bString = b.toString(2);
    let result = new BigNumber(1);
    for (let i = 0; i < bString.length; i += 1) {
      const bit = new BigNumber(bString[i]).shiftedBy(i);
      result = result.times(result);
      result = result.mod(c);
      if (!b.isEqualTo(0) && !bit.isEqualTo(0)) {
        result = result.times(a);
        result = result.mod(c);
      }
    }
    return result;
  }
}
