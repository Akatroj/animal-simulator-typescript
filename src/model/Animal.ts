import { Energy, SimulationDate, WorldMap } from './WorldMap';
import { Directions, DirectionsUtil } from './Directions';
import { Genome } from './Genome';
import { MapPosition } from './MapPosition';
import { PositionChangePublisher } from './IPositionChangeObserver';

export type Entity = Animal | Grass;

export class Animal extends PositionChangePublisher {
  private readonly myGenes: Genome;
  private birthDay: SimulationDate;
  private _position: MapPosition;
  private direction: Directions;
  private _energy: Energy;
  private deathDate: SimulationDate | null = null;

  constructor(map: WorldMap);
  constructor(map: WorldMap, parent1: Animal, parent2: Animal);

  constructor(private readonly map: WorldMap, parent1?: Animal, parent2?: Animal) {
    super();
    if (parent1 && parent2) {
      const energyFromParent1 = parent1._energy * map.energyPassedToChild;
      const energyFromParent2 = parent2._energy * map.energyPassedToChild;
      parent1._energy -= energyFromParent1;
      parent2._energy -= energyFromParent2;

      this._energy = energyFromParent1 + energyFromParent2;
      this._position = parent1._position;
      this.myGenes = new Genome(parent1.myGenes, parent2.myGenes);
    } else {
      this._energy = map.startEnergy;
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

  get position(): MapPosition {
    return this._position;
  }

  get energy(): Energy {
    return this._energy;
  }
}

export class Grass {
  constructor(public readonly position: MapPosition, public readonly energy: Energy) {}
}
