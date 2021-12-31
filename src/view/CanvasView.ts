import { Vector2d } from '../model/Vector2d';
import { WorldMap } from '../model/WorldMap';

export class CanvasView {
  private static readonly CANVAS_NAME = '#canvas';

  private readonly canvas: HTMLCanvasElement;
  private readonly context2d: CanvasRenderingContext2D;
  private readonly cellWidth: number;
  private readonly cellHeight: number;

  constructor(private readonly map: WorldMap) {
    this.canvas = document.querySelector(CanvasView.CANVAS_NAME) as HTMLCanvasElement;
    const context = this.canvas.getContext('2d');
    if (!context) throw new ReferenceError('Cannot get canvas context');
    this.context2d = context;
    this.cellWidth = Math.floor(this.canvas.width / this.map.width);
    this.cellHeight = Math.floor(this.canvas.height / this.map.height);

    this.context2d.textAlign = 'center';
    this.context2d.textBaseline = 'middle';
  }

  clear(): void {
    this.context2d.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawCellBorders(): void {
    // vertical
    for (let i = this.cellWidth; i < this.canvas.width; i += this.cellWidth) {
      this.context2d.moveTo(i, 0);
      this.context2d.lineTo(i, this.canvas.height);
    }

    // horizontal
    for (let i = this.cellHeight; i < this.canvas.height; i += this.cellHeight) {
      this.context2d.moveTo(0, i);
      this.context2d.lineTo(this.canvas.width, i);
    }
    this.context2d.stroke();
  }

  drawCells(): void {
    // jungle
    const { leftX, topY, width, height } = this.map.jungleBounds;
    this.context2d.fillStyle = 'lime';
    this.context2d.fillRect(leftX, topY, width, height); // to sa koordy mapy a nie canvasu debilu

    this.context2d.fillStyle = 'green';
    this.map.forEachGrassCell((grass, pos) => {
      const [x, y] = this.mapPosToCanvasPos(pos);
      this.context2d.fillRect(x, y, this.cellWidth, this.cellHeight);
    });

    //temp
    this.map.forEachAnimalCell((animals, position) => {
      this.context2d.fillStyle = 'red';

      const [x, y] = this.mapPosToCanvasPos(position);
      this.context2d.fillRect(x, y, this.cellWidth, this.cellHeight);

      this.context2d.fillStyle = 'black';

      this.context2d.fillText(
        animals.length.toFixed(),
        x + this.cellWidth / 2,
        y + this.cellHeight / 2
      );
    });
  }

  drawMap(): void {
    this.clear();
    this.drawCellBorders();
    this.drawCells();
  }

  private mapPosToCanvasPos(mapPos: Vector2d): [number, number] {
    return [mapPos.x * this.cellWidth, mapPos.y * this.cellHeight];
  }
}

export interface BoundingBox {
  leftX: number;
  topY: number;
  width: number;
  height: number;
}
