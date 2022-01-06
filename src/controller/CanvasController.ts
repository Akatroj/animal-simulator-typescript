import { MapPosition } from '../model/MapPosition';
import { WorldMap } from '../model/WorldMap';

type CanvasPosition = [number, number];
export class CanvasView {
  private static readonly CANVAS_NAME = '#canvas';
  private static readonly CANVAS_CONTAINER_NAME = '#canvas-container';
  private static readonly canvas: HTMLCanvasElement = document.querySelector(
    CanvasView.CANVAS_NAME
  ) as HTMLCanvasElement;
  private static readonly container: HTMLDivElement = document.querySelector(
    CanvasView.CANVAS_CONTAINER_NAME
  ) as HTMLDivElement;

  private readonly context2d: CanvasRenderingContext2D;

  // these will be set by handleResize() method.
  private cellWidth!: number;
  private cellHeight!: number;

  constructor(private readonly map: WorldMap) {
    const context = CanvasView.canvas.getContext('2d');
    if (!context) throw new ReferenceError('Cannot get canvas context');
    this.context2d = context;

    // this.context2d.textAlign = 'center';
    // this.context2d.textBaseline = 'middle';

    this.handleResize();
    this.attachListeners();
  }

  private attachListeners() {
    window.addEventListener('resize', () => {
      this.handleResize();
      this.drawMap();
    });
    CanvasView.canvas.addEventListener('click', e => {
      e.stopPropagation();
      console.log(this.canvasPosToMapPos([e.offsetX, e.offsetY]));
    });
  }

  clear(): void {
    this.context2d.fillStyle = 'white';
    this.context2d.fillRect(0, 0, CanvasView.canvas.width, CanvasView.canvas.height);
  }

  drawBorders(): void {
    // border around
    this.context2d.beginPath();
    this.context2d.rect(0, 0, CanvasView.canvas.width, CanvasView.canvas.height);

    // vertical cell borders
    for (let i = this.cellWidth; i < CanvasView.canvas.width; i += this.cellWidth) {
      this.context2d.moveTo(i, 0);
      this.context2d.lineTo(i, CanvasView.canvas.height);
    }

    // horizontal cell borders
    for (let i = this.cellHeight; i < CanvasView.canvas.height; i += this.cellHeight) {
      this.context2d.moveTo(0, i);
      this.context2d.lineTo(CanvasView.canvas.width, i);
    }
    this.context2d.stroke();
  }

  drawCells(): void {
    // jungle
    const [topLeft, bottomRight] = this.map.jungleBounds;
    const [leftX, topY] = this.mapPosToCanvasPos(topLeft);
    const [rightX, bottomY] = this.mapPosToCanvasPos(bottomRight);
    const [width, height] = [
      rightX - leftX + this.cellWidth,
      bottomY - topY + this.cellHeight,
    ];

    this.context2d.fillStyle = 'lime';
    this.context2d.fillRect(leftX, topY, width, height);

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
    this.drawCells();
    this.drawBorders();
  }

  private mapPosToCanvasPos(mapPos: MapPosition): CanvasPosition {
    return [mapPos.x * this.cellWidth, mapPos.y * this.cellHeight];
  }

  private canvasPosToMapPos([canvasX, canvasY]: CanvasPosition): MapPosition {
    const x = Math.floor(canvasX / this.cellWidth);
    const y = Math.floor(canvasY / this.cellHeight);
    return new MapPosition(x, y);
  }

  private handleResize(): void {
    const style = window.getComputedStyle(CanvasView.container);

    // prettier-ignore
    const [containerWidth, containerHeight] = [style.width, style.height].map(el =>parseInt(el));

    // calculate width and height as a common multiple of window size and map size.
    const height = Math.floor(containerHeight / this.map.height) * this.map.height;
    const width = Math.floor(containerWidth / this.map.width) * this.map.width;

    const mapRatio = this.map.width / this.map.height;
    CanvasView.canvas.height = Math.min(width / mapRatio, height);
    CanvasView.canvas.width = Math.min(height * mapRatio, width);
    this.cellWidth = Math.floor(CanvasView.canvas.width / this.map.width);
    this.cellHeight = Math.floor(CanvasView.canvas.height / this.map.height);
  }

  static showCanvas(): void {
    this.container.style.display = '';
  }

  static hideCanvas(): void {
    this.container.style.display = 'none';
  }
}
