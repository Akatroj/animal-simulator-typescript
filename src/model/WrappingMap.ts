import { random } from 'lodash';
import { Animal, Entity, Grass } from './Animal';
import { Vector2d } from './Vector2d';

export type SimulationDate = number;
export type Energy = number;
export class WrappingMap {
  private _today: SimulationDate = 0;

  private readonly jungle: Jungle;
  private readonly animalMap: EntityMap<Animal>;
  private readonly grassMap: EntityMap<Grass>;

  constructor(
    private width: number,
    private height: number,
    public readonly startEnergy: number,
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

  get randomPosition() {
    return new Vector2d(random(this.width - 1), random(this.height - 1));
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
      array.filter(el => el !== value);
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
