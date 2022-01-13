export class MapPosition {
  public readonly x: number;
  public readonly y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  toString(): string {
    return `(${this.x}, ${this.y})`;
  }

  add(other: MapPosition): MapPosition {
    return new MapPosition(this.x + other.x, this.y + other.y);
  }

  toArray(): [number, number] {
    return [this.x, this.y];
  }

  equals(other: unknown): boolean {
    if (!(other instanceof MapPosition)) return false;
    return this.x === other.x && this.y === other.y;
  }
}
