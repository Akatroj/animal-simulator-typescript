export class Vector2d {
  public readonly x: number;
  public readonly y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  toString(): string {
    return `(${this.x}, ${this.y})`;
  }

  add(other: Vector2d): Vector2d {
    return new Vector2d(this.x + other.x, this.y + other.y);
  }
}

console.log(new Vector2d(1, 1) === new Vector2d(1, 1));

console.log(new Vector2d(1, 1));

console.log(Object.is(new Vector2d(1, 1), new Vector2d(1, 1)));
