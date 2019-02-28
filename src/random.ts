import crypto from 'crypto';
import { BigNumber } from 'bignumber.js';

import 'source-map-support/register';

export class Random {
  private bytes: number;
  constructor(bytes: number) {
    this.bytes = bytes;
  }

  private isPrime(num: BigNumber): boolean {
    if (num.isEqualTo(2) || num.isEqualTo(3)) {
      return true;
    }

    if (num.isEqualTo(1) || num.mod(2).isEqualTo(0)) {
      return false;
    }

    const sqrt = num.squareRoot();
    let i = new BigNumber(3);

    while (i.isLessThan(sqrt)) {
      if (num.mod(i).isEqualTo(0)) {
        return false;
      }
      i = i.plus(2);
    }

    return true;
  }

  public generateRandom(): Promise<BigNumber> {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(this.bytes, (error, buffer) => {
        error ? reject(error) : resolve(new BigNumber(buffer.toString('hex'), 16));
      });
    });
  }
  public async generateRandomPrime(): Promise<BigNumber> {
    while (true) {
      const num = await this.generateRandom();
      if (this.isPrime(num)) {
        return num;
      }
    }
  }
}
