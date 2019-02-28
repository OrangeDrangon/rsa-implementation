import { BigNumber } from 'bignumber.js';

import { Random } from './random';

export class Encryptor {
  private random: Random;

  constructor(bytes: number) {
    this.random = new Random(bytes);
  }

  public async generateKeys() {
    const p = await this.random.generateRandomPrime();
    const q = await this.random.generateRandomPrime();

    // const p = new BigNumber(53);
    // const q = new BigNumber(61);

    const n = p.times(q);

    const totient = p.minus(1).times(q.minus(1));

    let e = new BigNumber(3);
    for (e; e.isLessThan(totient); e = e.plus(1)) {
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
