import { Encryptor } from './encryptor';

(async () => {
  const encryptor = new Encryptor(4);
  console.log(await encryptor.generateKeys());
})();
