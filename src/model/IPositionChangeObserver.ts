import { MapPosition } from './MapPosition';
import { remove } from 'lodash-es';

// TODO: move to world map?

export interface IPositionChangeObserver {
  positionChanged(
    oldPos: MapPosition,
    newPos: MapPosition,
    entity: PositionChangePublisher
  ): void;
}

export abstract class PositionChangePublisher {
  protected readonly observers: IPositionChangeObserver[] = [];

  addObserver(observer: IPositionChangeObserver): void {
    this.observers.push(observer);
  }

  removeObserver(observer: IPositionChangeObserver): void {
    remove(this.observers, el => el === observer);
  }

  notifyObservers(oldPos: MapPosition, newPos: MapPosition): void {
    this.observers.forEach(observer => observer.positionChanged(oldPos, newPos, this));
  }
}
