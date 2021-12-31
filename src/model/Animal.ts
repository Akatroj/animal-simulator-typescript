import { Energy, SimulationDate, WorldMap } from './WorldMap';
import { Directions, DirectionsUtil } from './Directions';
import { Genome } from './Genome';
import { Vector2d } from './Vector2d';
import { PositionChangePublisher } from './IPositionChangeObserver';

export type Entity = Animal | Grass;

export class Animal extends PositionChangePublisher {
  private readonly myGenes: Genome;
  private birthDay: SimulationDate;
  private _position: Vector2d;
  private direction: Directions;
  private energy: Energy;
  private deathDate: SimulationDate | null = null;

  constructor(map: WorldMap);
  constructor(map: WorldMap, parent1: Animal, parent2: Animal);

  constructor(private readonly map: WorldMap, parent1?: Animal, parent2?: Animal) {
    super();
    if (parent1 && parent2) {
      const energyFromParent1 = parent1.energy * map.energyPassedToChild;
      const energyFromParent2 = parent2.energy * map.energyPassedToChild;
      parent1.energy -= energyFromParent1;
      parent2.energy -= energyFromParent2;

      this.energy = energyFromParent1 + energyFromParent2;
      this._position = parent1._position;
      this.myGenes = new Genome(parent1.myGenes, parent2.myGenes);
    } else {
      this.energy = map.startEnergy;
      this._position = map.randomPosition;
      this.myGenes = new Genome();
    }
    this.direction = DirectionsUtil.randomDirection;
    this.birthDay = map.today;
  }

  move(): void {
    const oldPos = this._position;
    this._position = this.map.wrapPosition(
      this._position.add(DirectionsUtil.toUnitVector(this.direction))
    );
    this.direction = DirectionsUtil.next(this.direction, this.myGenes.randomGene);

    super.notifyObservers(oldPos, this._position);
  }

  get position(): Vector2d {
    return this._position;
  }
}

export class Grass {
  constructor(public readonly position: Vector2d, public readonly energy: Energy) {}
}
