export class Vector2d {
  public readonly x: number;
  public readonly y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  // toString(): string {
  //   return `(${this.x}, ${this.y})`;
  // }
}

console.log(new Vector2d(1, 1) === new Vector2d(1, 1));

console.log(new Vector2d(1, 1));

console.log(Object.is(new Vector2d(1, 1), new Vector2d(1, 1)));
