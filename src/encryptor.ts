import { BigNumber } from 'bignumber.js';

import { Random } from './random';
import { Utils } from './util';

export class Encryptor {
  private random: Random;

  constructor(bytes: number, primes: number[]) {
    this.random = new Random(bytes, primes);
  }

  public async generateKeys(): Promise<IKeys | undefined> {
    let p = new BigNumber(0);
    let q = new BigNumber(1);
    do {
      p = await this.random.generateRandomPrime(10);
      q = await this.random.generateRandomPrime(10);
    } while (p.isEqualTo(q));

    const n = p.times(q);

    const totient = p.minus(1).times(q.minus(1));

    let e = new BigNumber('10001', 16);
    for (e; e.isGreaterThanOrEqualTo(3); e = e.minus(2)) {
      if (this.isCoprime(e, totient)) {
        break;
      }
    }

    const d = this.extendedEuclideanAlgo(e, totient);

    if (d) {
      return {
        publicKey: {
          modulus: n,
          exponent: e,
        },
        privateKey: {
          modulus: n,
          exponent: d,
        },
      };
    }
    return;
  }

  public consumeKeys(key: IKey, data: BigNumber) {
    const { exponent, modulus } = key;

    return Utils.powMod(data, exponent, modulus);
  }

  private gcd(a: BigNumber, b: BigNumber): BigNumber {
    if (b.isEqualTo(0)) {
      return a;
    }
    return this.gcd(b, a.mod(b));
  }

  private isCoprime(a: BigNumber, b: BigNumber): boolean {
    return this.gcd(a, b).isEqualTo(1);
  }

  private extendedEuclideanAlgo(a: BigNumber, b: BigNumber) {
    let dOld = new BigNumber(0);
    let rOld = b.minus(0);

    let dNew = new BigNumber(1);
    let rNew = a.minus(0);

    while (rNew.isGreaterThan(0)) {
      const a = rOld.dividedToIntegerBy(rNew);

      let temp = dNew.minus(0);
      dNew = dOld.minus(a.times(temp));
      dOld = temp;

      temp = rNew.minus(0);
      rNew = rOld.minus(a.times(temp));
      rOld = temp;
    }
    if (rOld.isEqualTo(1)) {
      return dOld.mod(b).plus(b).mod(b);
    }
    return;
  }
}

interface IKeys {
  publicKey: IKey;
  privateKey: IKey;
}

interface IKey {
  exponent: BigNumber;
  modulus: BigNumber;
}
