import { Energy } from './model/WorldMap';

export type Config = {
  width: number;
  height: number;
  startEnergy: Energy;
  energyPassedToChild: number;
  jungleRatio: number;
  moveEnergy: Energy;
  startAnimalCount: number;
  grassEnergy: Energy;
  dayLength: number;
};

const defaultConfig: Config = {
  width: 10,
  height: 10,
  startEnergy: 100,
  jungleRatio: 0.2,
  energyPassedToChild: 0.5,
  moveEnergy: 1,
  startAnimalCount: 10,
  grassEnergy: 100,
  dayLength: 1000,
};

const configString = localStorage.getItem('config');
export let config: Config;

if (!configString) {
  localStorage.setItem('config', JSON.stringify(defaultConfig));
  config = defaultConfig;
} else {
  config = JSON.parse(configString);
}

console.log(config);

//TODO: change config to const?
