import { IPositionChangeObserver, PositionChangePublisher } from './IPositionChangeObserver';
import { random, remove } from 'lodash-es';
import { Animal, Entity, Grass } from './Animal';
import { Vector2d } from './Vector2d';

export type SimulationDate = number;
export type Energy = number;
export class WorldMap implements IPositionChangeObserver {
  private _today: SimulationDate = 0;

  private readonly jungle: Jungle;
  private readonly animalMap: EntityMap<Animal>;
  private readonly grassMap: EntityMap<Grass>;

  constructor(
    public readonly width: number,
    public readonly height: number,
    public readonly startEnergy: number, // to mozna wywalic?
    public readonly energyPassedToChild: number,
    jungleRatio: number
  ) {
    const lowerLeft = new Vector2d(
      Math.floor((width * (1 - jungleRatio)) / 2),
      Math.floor((height * (1 - jungleRatio)) / 2)
    );
    const upperRight = new Vector2d(
      Math.floor((width * (1 + jungleRatio)) / 2),
      Math.floor((height * (1 + jungleRatio)) / 2)
    );

    this.jungle = new Jungle(lowerLeft, upperRight);
    this.animalMap = new EntityMap(width, height);
    this.grassMap = new EntityMap(width, height);
  }

  get today(): SimulationDate {
    return this._today;
  }

  get randomPosition(): Vector2d {
    return new Vector2d(random(this.width - 1), random(this.height - 1));
  }

  get randomJunglePosition(): Vector2d {
    return this.jungle.randomPositionInJungle;
  }

  wrapPosition(pos: Vector2d): Vector2d {
    return new Vector2d(pos.x % this.width, pos.y % this.height);
  }

  positionChanged(oldPos: Vector2d, newPos: Vector2d, entity: PositionChangePublisher): void {
    if (entity instanceof Animal) {
      this.animalMap.delete(oldPos, entity);
      this.animalMap.set(newPos, entity);
    }
  }

  putEntity(entity: Entity): void {
    if (entity instanceof Animal) {
      this.animalMap.set(entity.position, entity);
    } else if (entity instanceof Grass) {
      this.grassMap.set(entity.position, entity);
    }
  }

  removeEntity(entity: Entity): void {
    if (entity instanceof Animal) {
      this.animalMap.delete(entity.position, entity);
    } else if (entity instanceof Grass) {
      this.grassMap.delete(entity.position, entity);
    }
  }
}

class Jungle {
  constructor(public readonly lowerLeft: Vector2d, public readonly upperRight: Vector2d) {}

  get randomPositionInJungle() {
    return new Vector2d(
      random(this.lowerLeft.x, this.upperRight.x),
      random(this.lowerLeft.y, this.upperRight.y)
    );
  }
}

export class EntityMap<V extends Entity> {
  private readonly map: Map<number, V[]> = new Map();

  constructor(private readonly columnCount: number, private readonly rowCount: number) {}

  private vectorToKey(vector: Vector2d): number {
    return vector.x + vector.y * this.columnCount;
  }

  get(key: Vector2d) {
    return this.map.get(this.vectorToKey(key));
  }

  set(key: Vector2d, value: V) {
    const array = this.get(key);
    if (array !== undefined) {
      array.push(value);
    } else {
      this.map.set(this.vectorToKey(key), [value]);
    }
  }

  delete(key: Vector2d, value: V) {
    const array = this.get(key);
    if (array !== undefined) {
      remove(array, el => el === value);
      if (array.length === 0) {
        this.map.delete(this.vectorToKey(key));
      }
      return true;
    }
    return false;
  }

  has(key: Vector2d) {
    return this.map.has(this.vectorToKey(key));
  }
}
