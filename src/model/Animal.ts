import { Energy, SimulationDate, WrappingMap } from './WrappingMap';
import { Directions, DirectionsUtil } from './Directions';
import { Genome } from './Genome';
import { Vector2d } from './Vector2d';

export type Entity = Animal | Grass;

export class Animal {
  public readonly myGenes: Genome;

  private birthDay: SimulationDate;
  private position: Vector2d;
  private direction: Directions;
  private energy: Energy;
  private deathDate: SimulationDate | null = null;

  constructor(map: WrappingMap);
  constructor(map: WrappingMap, parent1: Animal, parent2: Animal);

  constructor(map: WrappingMap, parent1?: Animal, parent2?: Animal) {
    if (parent1 && parent2) {
      const energyFromParent1 = parent1.energy * map.energyPassedToChild;
      const energyFromParent2 = parent2.energy * map.energyPassedToChild;
      parent1.energy -= energyFromParent1;
      parent2.energy -= energyFromParent2;

      this.energy = energyFromParent1 + energyFromParent2;
      this.position = parent1.position;
      this.myGenes = new Genome(parent1.myGenes, parent2.myGenes);
    } else {
      this.energy = map.startEnergy;
      this.position = map.randomPosition;
      this.myGenes = new Genome();
    }
    this.direction = DirectionsUtil.randomDirection;
    this.birthDay = map.today;
  }

  move(): void {
    this.position = this.position.add(DirectionsUtil.toUnitVector(this.direction));
    this.direction = DirectionsUtil.next(this.direction, this.myGenes.randomGene);
    // notify
  }

  // observer
}

export class Grass {}
