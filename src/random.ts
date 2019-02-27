import crypto from 'crypto';
import { BigNumber } from 'bignumber.js';

export class Random {
  constructor() {
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

  public generateRandom(bits: number): Promise<BigNumber> {
    return new Promise((resolve, reject) => {
      if (bits % 8 !== 0) {
        reject('Must be a multiple of 8');
      }
      crypto.randomBytes(bits / 8, (error, buffer) => {
        error ? reject(error) : resolve(new BigNumber(buffer.toString('hex'), 16));
      });
    });
  }
  public async generateRandomPrime(bits: number): Promise<BigNumber> {
    while (true) {
      const num = await this.generateRandom(bits);
      if (this.isPrime(num)) {
        return num;
      }
    }
  }
}
