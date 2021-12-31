import { Vector2d } from './Vector2d';
import { remove } from 'lodash-es';

// TODO: move to world map?

export interface IPositionChangeObserver {
  positionChanged(oldPos: Vector2d, newPos: Vector2d, entity: PositionChangePublisher): void;
}

export abstract class PositionChangePublisher {
  protected readonly observers: IPositionChangeObserver[] = [];

  addObserver(observer: IPositionChangeObserver): void {
    this.observers.push(observer);
  }

  removeObserver(observer: IPositionChangeObserver): void {
    remove(this.observers, el => el === observer);
  }

  notifyObservers(oldPos: Vector2d, newPos: Vector2d): void {
    this.observers.forEach(observer => observer.positionChanged(oldPos, newPos, this));
  }
}
