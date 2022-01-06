import { WorldMap } from './../model/WorldMap';
import { Animal } from '../model';
import { remove } from 'lodash-es';
import { Config, Energy } from '../model';
export class SimulationController {
  public readonly map: WorldMap;

  private readonly animalList: Animal[] = [];
  private readonly energyToBreed: number;
  private readonly moveEnergy: Energy;
  private deadAnimalCount = 0;

  // TODO:
  constructor(config: Config) {
    const {
      width,
      height,
      startEnergy,
      energyPassedToChild,
      jungleRatio,
      moveEnergy,
      startAnimalCount,
    } = config;
    this.map = new WorldMap(width, height, startEnergy, energyPassedToChild, jungleRatio);
    this.energyToBreed = Math.floor(startEnergy / 2);
    this.moveEnergy = moveEnergy;
    this.populateMap(startAnimalCount);
  }

  private populateMap(startAnimalCount: number): void {
    for (let i = 0; i < startAnimalCount; i++) {
      const animal = new Animal(this.map);
      this.animalList.push(animal);
      this.map.putEntity(animal);
    }
  }

  private removeDeadAnimals(): void {
    remove(this.animalList, animal => {
      if (animal.isDead) {
        this.deadAnimalCount++;
        this.map.removeEntity(animal);
        return true;
      }
      return false;
    });
  }

  private moveAnimals(): void {
    this.animalList.forEach(animal => animal.move());
  }

  private breedAnimals(): void {
    this.map.forEachAnimalCell(animalsAtPos => {
      if (animalsAtPos.length > 1) {
        const [parent1, parent2] = [animalsAtPos[0], animalsAtPos[1]];
        if (parent1.energy > this.energyToBreed && parent2.energy > this.energyToBreed) {
          const child = new Animal(this.map, parent1, parent2);
          this.map.putEntity(child);
        }
      }
    });
  }

  public nextDay(): void {
    this.moveAnimals();
    this.removeDeadAnimals();
    this.breedAnimals();
  }
}
