import { WrappingMap } from './model/WrappingMap';
import { Animal } from './model/Animal';

const defaultConfig = {
  width: 10,
  height: 10,
  startEnergy: 100,
  jungleRatio: 0.2,
  energyPassedToChild: 0.5,
};
type Config = typeof defaultConfig;

const configString = localStorage.getItem('config');
let config: Config;

if (!configString) {
  localStorage.setItem('config', JSON.stringify(defaultConfig));
  config = defaultConfig;
} else {
  config = JSON.parse(configString);
}

const map = new WrappingMap(
  config.width,
  config.height,
  config.startEnergy,
  config.energyPassedToChild,
  config.jungleRatio
);
const animal = new Animal(map);

console.log(animal);
