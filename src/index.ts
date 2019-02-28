import { Encryptor } from './encryptor';
import { BigNumber } from 'bignumber.js';

(async () => {
  const encryptor = new Encryptor(4);
  const keys = await encryptor.generateKeys();
  if (keys) {
    const e = keys.publicKey.exponent;
    const d = keys.privateKey.exponent;
    const n = keys.privateKey.modulus;

    try {
      const ed = new BigNumber(123).pow(e).mod(n).plus(n).mod(n);
      const dd = ed.pow(d).mod(n).plus(n).mod(n);

      console.log(ed.toString(), dd.toString(), dd.isEqualTo(123));
    } catch (error) { }
  }
})();
