import { IPositionChangeObserver, PositionChangePublisher } from './IPositionChangeObserver';
import { random, remove } from 'lodash-es';
import { Animal, Entity, Grass } from './Animal';
import { MapPosition } from './MapPosition';

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
    const topLeft = new MapPosition(
      Math.floor((width * (1 - jungleRatio)) / 2),
      Math.floor((height * (1 - jungleRatio)) / 2)
    );
    const bottomRight = new MapPosition(
      Math.floor((width * (1 + jungleRatio)) / 2),
      Math.floor((height * (1 + jungleRatio)) / 2)
    );

    console.log(topLeft, bottomRight);
    this.jungle = new Jungle(topLeft, bottomRight);
    this.animalMap = new EntityMap(width, height);
    this.grassMap = new EntityMap(width, height);
  }

  get today(): SimulationDate {
    return this._today;
  }

  get randomPosition(): MapPosition {
    return new MapPosition(random(this.width - 1), random(this.height - 1));
  }

  get randomJunglePosition(): MapPosition {
    return this.jungle.randomPositionInJungle;
  }

  get jungleBounds(): [MapPosition, MapPosition] {
    return [this.jungle.topLeft, this.jungle.bottomRight];
  }

  objectAtPosition(pos: MapPosition): Entity | null {
    const animals = this.animalMap.get(pos);
    if (animals) return animals[0];
    const grass = this.grassMap.get(pos);
    if (grass) return grass[0];
    return null;
  }

  wrapPosition(pos: MapPosition): MapPosition {
    return new MapPosition(pos.x % this.width, pos.y % this.height);
  }

  positionChanged(
    oldPos: MapPosition,
    newPos: MapPosition,
    entity: PositionChangePublisher
  ): void {
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

  forEachAnimalCell(callback: (animals: Animal[], position: MapPosition) => void): void {
    this.animalMap.forEach(callback);
  }

  forEachGrassCell(callback: (grass: Grass, position: MapPosition) => void): void {
    this.grassMap.forEach((grass, key) => callback(grass[0], key));
  }
}

class Jungle {
  constructor(
    public readonly topLeft: MapPosition,
    public readonly bottomRight: MapPosition
  ) {}

  get randomPositionInJungle() {
    return new MapPosition(
      random(this.topLeft.x, this.bottomRight.x),
      random(this.topLeft.y, this.bottomRight.y)
    );
  }
}

class EntityMap<V extends Entity> {
  private readonly map: Map<number, V[]> = new Map();

  constructor(private readonly columnCount: number, private readonly rowCount: number) {}

  private vectorToKey(vector: MapPosition): number {
    if (vector.x > this.columnCount || vector.y > this.rowCount)
      throw new RangeError('Vector not on map');
    return vector.x + vector.y * this.columnCount;
  }

  private keyToVector(key: number): MapPosition {
    const x = key % this.columnCount;
    const y = (key - x) / this.columnCount;
    return new MapPosition(x, y);
  }

  get(key: MapPosition): V[] | undefined {
    return this.map.get(this.vectorToKey(key));
  }

  set(key: MapPosition, value: V): void {
    const array = this.get(key);
    if (array !== undefined) {
      array.push(value);
      array.sort((el1, el2) => el1.energy - el2.energy);
    } else {
      this.map.set(this.vectorToKey(key), [value]);
    }
  }

  delete(key: MapPosition, value: V): boolean {
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

  has(key: MapPosition): boolean {
    return this.map.has(this.vectorToKey(key));
  }

  forEach(callback: (value: V[], key: MapPosition) => void): void {
    this.map.forEach((value, key) => {
      callback(value, this.keyToVector(key));
    });
  }
}
