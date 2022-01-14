import {
  IPositionChangeObserver,
  PositionChangePublisher,
  SimulationDate,
  MapPosition,
  Animal,
  Entity,
  Grass,
} from '.';
import { random, remove } from 'lodash-es';

export class WorldMap implements IPositionChangeObserver {
  private _today: SimulationDate = 0;

  private readonly jungle: Jungle;
  private readonly animalMap: EntityMap<Animal>;
  private readonly grassMap: EntityMap<Grass>;

  constructor(
    public readonly width: number,
    public readonly height: number,
    public readonly startEnergy: number,
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

  nextDay(): void {
    this._today++;
    // this.animalMap.forEach(animals => console.log(animals));
  }

  get today(): SimulationDate {
    return this._today;
  }

  get jungleBounds(): [MapPosition, MapPosition] {
    return [this.jungle.topLeft, this.jungle.bottomRight];
  }

  objectAtPosition(pos: MapPosition): Entity | null {
    return this.getAnimal(pos) ?? this.getGrass(pos) ?? null;
  }

  getRandomPosition(): MapPosition {
    return new MapPosition(random(this.width - 1), random(this.height - 1));
  }

  getRandomJunglePosition(): MapPosition {
    return this.jungle.getRandomPositionInJungle();
  }

  wrapPosition(pos: MapPosition): MapPosition {
    const mod = (a: number, n: number): number => ((a % n) + n) % n; // returns positive value for negative a
    return new MapPosition(mod(pos.x, this.width), mod(pos.y, this.height));
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

  putAnimal(animal: Animal): void {
    this.animalMap.set(animal.position, animal);
    animal.addObserver(this);
  }

  putGrass(grass: Grass): void {
    this.grassMap.set(grass.position, grass);
  }

  removeAnimal(animal: Animal): void {
    this.animalMap.delete(animal.position, animal);
    animal.removeObserver(this);
  }

  removeGrass(grass: Grass): void {
    this.grassMap.delete(grass.position, grass);
  }

  getAnimals(pos: MapPosition): Animal[] | null {
    return this.animalMap.get(pos) ?? null;
  }

  getAnimal(pos: MapPosition): Animal | null {
    return this.getEntity(this.animalMap, pos);
  }

  getGrass(pos: MapPosition): Grass | null {
    return this.getEntity(this.grassMap, pos);
  }

  // helper function to get either grass or animals from position
  private getEntity<T extends Entity>(entityMap: EntityMap<T>, pos: MapPosition): T | null {
    const entities = entityMap.get(pos);
    if (entities && entities.length > 0) return entities[0];
    return null;
  }

  forEachAnimalCell(callback: (animals: Animal[], position: MapPosition) => void): void {
    this.animalMap.forEach((animals, pos) => callback(animals, pos));
  }

  forEachGrassCell(callback: (grass: Grass, position: MapPosition) => void): void {
    this.grassMap.forEach((grass, pos) => callback(grass[0], pos));
  }
}

class Jungle {
  constructor(
    public readonly topLeft: MapPosition,
    public readonly bottomRight: MapPosition
  ) {}

  getRandomPositionInJungle() {
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
