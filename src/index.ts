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

function onSubmit(e: Event) {
  e.preventDefault();
  const form = e.target as HTMLFormElement;
  const dupa = Object.fromEntries(new FormData(form).entries());
  console.log(dupa);
  form.style.display = 'none';
  const canvasContainer = document.querySelector('#canvas-container') as HTMLDivElement;
  // canvasContainer.style.visibility = 'visible';
  canvasContainer.style.display = '';
}

document.querySelector('form.config')?.addEventListener('submit', e => onSubmit(e));

const canvasContainer = document.querySelector('#canvas-container') as HTMLDivElement;
canvasContainer.style.display = 'none'; // important

//TODO: ten plik poprawic bo jakis obrzygany jest
