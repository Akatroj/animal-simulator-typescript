import { WorldMap } from './model/WorldMap';
import { Animal } from './model/Animal';
import { config } from './config';

const map = new WorldMap(
  config.width,
  config.height,
  config.startEnergy,
  config.energyPassedToChild,
  config.jungleRatio
);

const animal = new Animal(map);

console.log(animal);
