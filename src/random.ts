import crypto from 'crypto';
import { BigNumber } from 'bignumber.js';

export class Random {
  constructor() {
  }

  private isPrime(num: BigNumber, iterations: number): boolean {
    if (num.isEqualTo(2) || num.isEqualTo(3)) {
      return true;
    }
    if (num.mod(2).isEqualTo(0) || num.isLessThan(2)) {
      return false;
    }

    // Write (n - 1) as 2^s * d
    let s = new BigNumber(0);
    let d = num.minus(1);
    while (d.mod(2).isEqualTo(0)) {
      d = d.dividedBy(2);
      s = s.plus(1);
    }

    let k = iterations - 1;

    WitnessLoop: do {
      // A base between 2 and n - 2
      // let x = Math.pow(2 + Math.floor(Math.random() * (n - 3)), d) % n;

      let x = num.minus(4).times(Math.random()).integerValue(BigNumber.ROUND_FLOOR).pow(d).mod(num);

      if (x.isEqualTo(1) || x.isEqualTo(num.minus(1))) {
        continue;
      }

      for (let i = s.toNumber() - 1; i -= 1;) {
        x = x.times(x).mod(num);
        if (x.isEqualTo(1)) {
          return false;
        }
        if (x.isEqualTo(num.minus(1))) {
          continue WitnessLoop;
        }
      }

      return false;
    } while (k -= 1);

    return true;
  }

  public generateRandom(bits: number): Promise<BigNumber> {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(bits / 8, (error, buffer) => {
        error ? reject(error) : resolve(new BigNumber(buffer.toString('hex'), 16));
      });
    });
  }
  public async generateRandomPrime(bits: number) {
    let count = 0;
    for (let i = 0; i < 1000; i += 1) {
      const result = this.isPrime(new BigNumber(23), 1);
      if (result) {
        count += 1;
      }
      console.log(count);
    }
    return count;
  }

}
