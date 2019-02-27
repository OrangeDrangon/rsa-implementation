import { Random } from './random';

(async () => {
  console.log((await new Random().generateRandomPrime(1024)));
})();
