import { WorldMap } from './WorldMap';
import { Directions, DirectionsUtil } from './Directions';
import { Genome } from './Genome';
import { MapPosition } from './MapPosition';
import { PositionChangePublisher } from './utils/Publishers';
import { Energy, SimulationDate } from './utils';

export type Entity = Animal | Grass;
export class Animal extends PositionChangePublisher {
  public readonly birthDay: SimulationDate;
  public readonly myGenes: Genome;

  private direction: Directions;
  private deathDate: SimulationDate | null = null;
  private _position: MapPosition;
  private _energy: Energy;
  private _childCount = 0;

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

      parent1._childCount++;
      parent2._childCount++;
    } else {
      this._energy = map.startEnergy;
      this._position = map.getRandomPosition();
      this.myGenes = new Genome();
    }
    this.direction = DirectionsUtil.randomDirection;
    this.birthDay = map.today;
  }

  move(): void {
    if (this.isDead) return;

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

  get isDead(): boolean {
    return this.deathDate !== null;
  }

  get childCount(): number {
    return this._childCount;
  }

  get energy(): Energy {
    return this._energy;
  }

  set energy(energy: Energy) {
    this._energy = energy;
    if (energy <= 0) {
      this.deathDate = this.map.today;
      this._energy = 0;
    }
  }
}

export class Grass {
  constructor(public readonly position: MapPosition, public readonly energy: Energy) {}
}
