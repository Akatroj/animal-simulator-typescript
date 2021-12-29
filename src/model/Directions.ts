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
  static toString(direction: Directions): string {
    return Directions[direction];
  }

  static next(direction: Directions, step: number): Directions {
    return (direction + step) % Directions.__Length;
  }

  static getRandomDirection(): Directions {
    return random(Directions.__Length - 1);
  }
}

console.log(DirectionsUtil.toString(DirectionsUtil.next(Directions.NorthWest, 1)));

console.log(DirectionsUtil.toString(DirectionsUtil.getRandomDirection()));
