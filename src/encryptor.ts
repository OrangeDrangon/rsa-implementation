import { BigNumber } from 'bignumber.js';

import { Random } from './random';

export class Encryptor {
  private random: Random;

  private p: BigNumber;
  private q: BigNumber;
  private modulus: BigNumber;

  constructor(bytes: number) {
    this.random = new Random(bytes);
    this.p = new BigNumber(0);
    this.q = new BigNumber(0);

    this.modulus = new BigNumber(0);
  }

  public async generateKeys(): Promise<{ publicKey: BigNumber[], privateKey: BigNumber[] }> {
    this.p = await this.random.generateRandomPrime();
    this.q = await this.random.generateRandomPrime();

    this.modulus = this.p.times(this.q);

    const lengthNonComonFactor = this.p.minus(1).times(this.q.minus(1));
    let encryptor = new BigNumber(2);
    while (encryptor.isLessThan(lengthNonComonFactor)) {
      if (this.isCoprime(this.modulus, encryptor)
        && this.isCoprime(lengthNonComonFactor, encryptor)) {
        break;
      }
      encryptor = encryptor.plus(1);
    }
    const publicKey = [encryptor, this.modulus];

    const decryptor = new BigNumber(10)
      .times(lengthNonComonFactor).plus(1).dividedToIntegerBy(encryptor);

    const privateKey = [decryptor, this.modulus];

    return { publicKey, privateKey };
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
}
