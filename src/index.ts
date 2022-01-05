import { ConfigController } from './view/FormController';
import { CanvasView } from './view/CanvasView';
import { WorldMap } from './model/WorldMap';
import { Animal } from './model/Animal';

const canvasContainer = document.querySelector('#canvas-container') as HTMLDivElement;
canvasContainer.style.display = 'none'; // important

const formController = new ConfigController();

const config = formController.config;

// TODO: przeniesc do klasy inicjalizujacej

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

view.drawMap(); // TODO: to musi sie wywolac po submicie

//TODO: ten plik poprawic bo jakis obrzygany jest
