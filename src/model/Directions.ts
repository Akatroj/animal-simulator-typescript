import { MapPosition } from './MapPosition';
import { random } from 'lodash-es';

export enum Directions {
  North = 0,
  NorthEast,
  East,
  SouthEast,
  South,
  SouthWest,
  West,
  NorthWest,
  __Length,
}

export class DirectionsUtil {
  static get randomDirection(): Directions {
    return random(Directions.__Length - 1);
  }

  static toString(direction: Directions): string {
    return Directions[direction];
  }

  static next(direction: Directions, step: number): Directions {
    return (direction + step) % Directions.__Length;
  }

  static toUnitVector(direction: Directions): MapPosition {
    switch (direction) {
      case Directions.North:
        return new MapPosition(0, 1);
      case Directions.NorthEast:
        return new MapPosition(1, 1);
      case Directions.East:
        return new MapPosition(1, 0);
      case Directions.SouthEast:
        return new MapPosition(1, -1);
      case Directions.South:
        return new MapPosition(0, -1);
      case Directions.SouthWest:
        return new MapPosition(-1, -1);
      case Directions.West:
        return new MapPosition(-1, 0);
      case Directions.NorthWest:
        return new MapPosition(-1, 1);
      default:
        throw new TypeError('Illegal enum state');
    }
  }
}
