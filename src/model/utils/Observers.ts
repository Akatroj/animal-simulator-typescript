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

export interface IConfigSubmitObserver {
  formSubmitted(config: Config): void;
}

export interface ICanvasClickObserver {
  canvasClicked(pos: MapPosition): void;
}
