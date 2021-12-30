import { Vector2d } from './Vector2d';
import { random } from 'lodash';

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
    let result: Vector2d;
    switch (direction) {
      case Directions.North:
        result = new Vector2d(0, 1);
        break;
      case Directions.NorthEast:
        result = new Vector2d(1, 1);
        break;
      case Directions.East:
        result = new Vector2d(1, 0);
        break;
      case Directions.SouthEast:
        result = new Vector2d(1, -1);
        break;
      case Directions.South:
        result = new Vector2d(0, -1);
        break;
      case Directions.SouthWest:
        result = new Vector2d(-1, -1);
        break;
      case Directions.West:
        result = new Vector2d(-1, 0);
        break;
      case Directions.NorthWest:
        result = new Vector2d(-1, 1);
        break;
      default:
        throw new TypeError('Illegal enum state');
    }
    return result;
  }
}

console.log(DirectionsUtil.toString(DirectionsUtil.next(Directions.NorthWest, 1)));

console.log(DirectionsUtil.toString(DirectionsUtil.randomDirection));
