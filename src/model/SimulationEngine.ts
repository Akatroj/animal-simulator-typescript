import { Animal, Grass, Config, Energy, WorldMap, MapPosition, SimulationDate } from '.';
import { remove, countBy } from 'lodash-es';

export class SimulationEngine {
  public readonly map: WorldMap;

  private readonly animalList: Animal[] = [];
  private readonly energyToBreed: number;
  private readonly moveEnergy: Energy;
  private readonly grassEnergy: Energy;
  private deadAnimalCount = 0;
  private totalAnimalAge = 0;

  constructor(config: Config) {
    const {
      width,
      height,
      startEnergy,
      energyPassedToChild,
      jungleRatio,
      moveEnergy,
      startAnimalCount,
      grassEnergy,
    } = config;
    this.map = new WorldMap(width, height, startEnergy, energyPassedToChild, jungleRatio);
    this.energyToBreed = Math.floor(startEnergy / 2);
    this.grassEnergy = grassEnergy;
    this.moveEnergy = moveEnergy;
    this.populateMap(startAnimalCount);
  }

  get aliveAnimals(): number {
    return this.animalList.length;
  }

  get averageAnimalDeathAge(): SimulationDate {
    return this.totalAnimalAge / this.deadAnimalCount || 0;
  }

  //TODO: optimisation - e.g. add a map of alive genotypes, updated with each death/birth
  get dominatingGenome(): string | null {
    if (this.aliveAnimals === 0) return null;
    const genomes = this.animalList.map(animal => animal.myGenes.toString());
    const genomeOccurences = Object.entries(countBy(genomes));
    genomeOccurences.sort(([, occurence1], [, occurence2]) => occurence1 - occurence2);
    return genomeOccurences[0][0];
  }

  private populateMap(startAnimalCount: number): void {
    for (let i = 0; i < startAnimalCount; i++) {
      const animal = new Animal(this.map);
      this.animalList.push(animal);
      this.map.putAnimal(animal);
    }
  }

  private removeDeadAnimals(): void {
    remove(this.animalList, animal => {
      if (animal.isDead) {
        this.totalAnimalAge += this.map.today - animal.birthDay;
        this.deadAnimalCount++;
        this.map.removeAnimal(animal);
        return true;
      }
      return false;
    });
  }

  private moveAnimals(): void {
    this.animalList.forEach(animal => {
      animal.move();
      animal.energy -= this.moveEnergy;
    });
  }

  private breedAnimals(): void {
    this.map.forEachAnimalCell(animalsAtPos => {
      if (animalsAtPos.length > 1) {
        const [parent1, parent2] = [animalsAtPos[0], animalsAtPos[1]];
        if (parent1.energy > this.energyToBreed && parent2.energy > this.energyToBreed) {
          const child = new Animal(this.map, parent1, parent2);
          this.map.putAnimal(child);
          this.animalList.push(child);
        }
      }
    });
  }

  private eatGrass(): void {
    this.map.forEachAnimalCell((animals, pos) => {
      const grass = this.map.getGrass(pos);
      if (grass) {
        const animal = animals[0];
        animal.energy += grass.energy;
        this.map.removeGrass(grass);
      }
    });
  }

  private growGrass(): void {
    this.grassGenerator(() => this.map.getRandomJunglePosition());
    this.grassGenerator(() => this.map.getRandomPosition());
  }

  private grassGenerator(posGenerator: () => MapPosition): void {
    const maxTries = 50;
    for (let i = 0; i < maxTries; i++) {
      const position = posGenerator();
      if (this.map.getGrass(position) === null) {
        this.map.putGrass(new Grass(position, this.grassEnergy));
        break;
      }
    }
  }

  public nextDay(): void {
    this.map.nextDay();
    this.moveAnimals();
    this.removeDeadAnimals();
    this.eatGrass();
    this.breedAnimals();
    this.growGrass();
  }
}
