const defaultConfig = {
  width: 10,
  height: 10,
  startEnergy: 100,
  jungleRatio: 0.2,
  energyPassedToChild: 0.5,
};

export type Config = typeof defaultConfig;

const configString = localStorage.getItem('config');
export let config: Config;

if (!configString) {
  localStorage.setItem('config', JSON.stringify(defaultConfig));
  config = defaultConfig;
} else {
  config = JSON.parse(configString);
}

//TODO: change config to const?
