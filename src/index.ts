import { Encryptor } from './encryptor';

(async () => {
  const encryptor = new Encryptor(1);
  console.log(await encryptor.generateKeys());
})();
