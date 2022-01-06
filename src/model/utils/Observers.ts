import { Config } from '.';
import { MapPosition } from '../MapPosition';
import { PositionChangePublisher } from './Publishers';

export interface IPositionChangeObserver {
  positionChanged(
    oldPos: MapPosition,
    newPos: MapPosition,
    entity: PositionChangePublisher
  ): void;
}

export interface IConfigSubmitListener {
  formSubmitted(config: Config): void;
}
