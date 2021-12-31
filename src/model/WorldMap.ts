import { BoundingBox } from './../view/CanvasView';
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

  get jungleBounds(): BoundingBox {
    return this.jungle.boundingBox;
  }

  objectAtPosition(pos: Vector2d): Entity | null {
    const animals = this.animalMap.get(pos);
    if (animals) return animals[0];
    const grass = this.grassMap.get(pos);
    if (grass) return grass[0];
    return null;
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

  // todo: rozbic na 2 metody
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

  forEachAnimalCell(callback: (animals: Animal[], position: Vector2d) => void): void {
    this.animalMap.forEach(callback);
  }

  forEachGrassCell(callback: (grass: Grass, position: Vector2d) => void): void {
    this.grassMap.forEach((grass, key) => callback(grass[0], key));
  }
}

class Jungle {
  public readonly boundingBox: BoundingBox;

  constructor(public readonly lowerLeft: Vector2d, public readonly upperRight: Vector2d) {
    const leftX = lowerLeft.x;
    const topY = upperRight.y;
    const width = upperRight.x - lowerLeft.x;
    const height = upperRight.y - lowerLeft.y;
    this.boundingBox = { leftX, topY, width, height } as const;
  }

  get randomPositionInJungle() {
    return new Vector2d(
      random(this.lowerLeft.x, this.upperRight.x),
      random(this.lowerLeft.y, this.upperRight.y)
    );
  }
}

class EntityMap<V extends Entity> {
  private readonly map: Map<number, V[]> = new Map();

  constructor(private readonly columnCount: number, private readonly rowCount: number) {}

  private vectorToKey(vector: Vector2d): number {
    if (vector.x > this.columnCount || vector.y > this.rowCount)
      throw new RangeError('Vector not on map');
    return vector.x + vector.y * this.columnCount;
  }

  private keyToVector(key: number): Vector2d {
    const x = key % this.columnCount;
    const y = (key - x) / this.columnCount;
    return new Vector2d(x, y);
  }

  get(key: Vector2d): V[] | undefined {
    return this.map.get(this.vectorToKey(key));
  }

  set(key: Vector2d, value: V): void {
    const array = this.get(key);
    if (array !== undefined) {
      array.push(value);
      array.sort((el1, el2) => el1.energy - el2.energy);
    } else {
      this.map.set(this.vectorToKey(key), [value]);
    }
  }

  delete(key: Vector2d, value: V): boolean {
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

  has(key: Vector2d): boolean {
    return this.map.has(this.vectorToKey(key));
  }

  forEach(callback: (value: V[], key: Vector2d) => void): void {
    this.map.forEach((value, key) => {
      callback(value, this.keyToVector(key));
    });
  }
}
