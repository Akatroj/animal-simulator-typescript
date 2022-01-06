import { remove } from 'lodash-es';
import { MapPosition } from '..';
import { IConfigSubmitListener, IPositionChangeObserver } from './Observers';
import { Config } from './types';

abstract class Publisher<ObserverType> {
  protected readonly observers: ObserverType[] = [];

  addObserver(observer: ObserverType): void {
    this.observers.push(observer);
  }

  removeObserver(observer: ObserverType): void {
    remove(this.observers, el => el === observer);
  }
}

export abstract class PositionChangePublisher extends Publisher<IPositionChangeObserver> {
  notifyObservers(oldPos: MapPosition, newPos: MapPosition): void {
    this.observers.forEach(observer => observer.positionChanged(oldPos, newPos, this));
  }
}

export abstract class ConfigSubmitPublisher extends Publisher<IConfigSubmitListener> {
  notifyObservers(config: Config): void {
    this.observers.forEach(observer => observer.formSubmitted(config));
  }
}
