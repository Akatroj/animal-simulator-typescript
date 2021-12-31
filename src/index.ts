import { CanvasView } from './view/CanvasView';
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

for (let i = 0; i < 10; i++) {
  const animal = new Animal(map);
  map.putEntity(animal);
}

const view = new CanvasView(map);

view.drawMap();
