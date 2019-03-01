import { Encryptor } from './encryptor';
import { BigNumber } from 'bignumber.js';

import { primes } from './primes';

(async () => {
  const encryptor = new Encryptor(4, primes);
  const keys = await encryptor.generateKeys();
  if (keys) {
    try {
      console.log(keys);
      const ed = encryptor.consumeKeys(keys.publicKey, new BigNumber(123));
      const dd = encryptor.consumeKeys(keys.privateKey, ed);

      console.log(ed.toString(), dd.toString());
    } catch (error) {
      console.error(error);
    }
  }
})();
