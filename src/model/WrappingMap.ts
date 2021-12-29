import { Vector2d } from './Vector2d';
declare class Jungle {
  constructor(lowerLeft: Vector2d, upperRight: Vector2d);
}

export class WrappingMap {
  private readonly jungle: Jungle;

  constructor(private width: number, private height: number, jungleRatio: number) {
    const lowerLeft = new Vector2d(
      Math.floor((this.width * (1 - jungleRatio)) / 2),
      Math.floor((this.height * (1 - jungleRatio)) / 2)
    );
    const upperRight = new Vector2d(
      Math.floor((this.width * (1 + jungleRatio)) / 2),
      Math.floor((this.height * (1 + jungleRatio)) / 2)
    );

    this.jungle = new Jungle(lowerLeft, upperRight);
  }
}
