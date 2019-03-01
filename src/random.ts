import crypto from 'crypto';
import { BigNumber } from 'bignumber.js';

import 'source-map-support/register';
import { Utils } from './util';

export class Random {
  private bytes: number;
  private primes: number[];
  constructor(bytes: number, primes: number[]) {
    this.bytes = bytes;
    this.primes = primes;
  }

  private millerRabin(num: BigNumber, d: BigNumber) {
    const a = new BigNumber(Math.random())
      .times(num.minus(4))
      .plus(5)
      .integerValue(BigNumber.ROUND_FLOOR);

    let x = Utils.powMod(a, d, num);

    if (x.isEqualTo(1) || x.isEqualTo(num.minus(1))) {
      return true;
    }

    let dNew = d.minus(0);

    while (!dNew.isEqualTo(num.minus(1))) {
      x = Utils.powMod(x, new BigNumber(2), num);
      dNew = d.times(2);

      if (x.isEqualTo(1)) {
        return false;
      }

      if (x.isEqualTo(num.minus(1))) {
        return true;
      }
    }
    return false;
  }

  private isPrime(num: BigNumber, k: number): boolean {
    if (num.isEqualTo(2) || num.isEqualTo(3)) {
      return true;
    }

    if (num.isEqualTo(1) || num.mod(2).isEqualTo(0)) {
      return false;
    }

    for (const prime of this.primes) {
      if (num.mod(prime).isEqualTo(0)) {
        return false;
      }
    }
    let d = num.minus(1);
    while (d.mod(2).isEqualTo(0)) {
      d = d.dividedBy(2).integerValue(BigNumber.ROUND_FLOOR);
    }
    for (let i = 0; i < k; i += 1) {
      if (!this.millerRabin(num, d)) {
        return false;
      }
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
  public async generateRandomPrime(k: number): Promise<BigNumber> {
    while (true) {
      const num = await this.generateRandom();
      if (this.isPrime(num, k)) {
        return num;
      }
    }
  }
}
