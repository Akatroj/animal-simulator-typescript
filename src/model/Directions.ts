import { Vector2d } from './Vector2d';
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

  static toUnitVector(direction: Directions): Vector2d {
    switch (direction) {
      case Directions.North:
        return new Vector2d(0, 1);
      case Directions.NorthEast:
        return new Vector2d(1, 1);
      case Directions.East:
        return new Vector2d(1, 0);
      case Directions.SouthEast:
        return new Vector2d(1, -1);
      case Directions.South:
        return new Vector2d(0, -1);
      case Directions.SouthWest:
        return new Vector2d(-1, -1);
      case Directions.West:
        return new Vector2d(-1, 0);
      case Directions.NorthWest:
        return new Vector2d(-1, 1);
      default:
        throw new TypeError('Illegal enum state');
    }
  }
}

// console.log(DirectionsUtil.toString(DirectionsUtil.next(Directions.NorthWest, 1)));

// console.log(DirectionsUtil.toString(DirectionsUtil.randomDirection));
