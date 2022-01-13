import { MapPosition } from '..';
import { Config, PositionChangePublisher } from '.';

export interface IPositionChangeObserver {
  positionChanged(
    oldPos: MapPosition,
    newPos: MapPosition,
    entity: PositionChangePublisher
  ): void;
}

export interface IConfigSubmitObserver {
  configSubmitted(config: Config): void;
}

export interface ICanvasClickObserver {
  canvasClicked(pos: MapPosition): void;
}
