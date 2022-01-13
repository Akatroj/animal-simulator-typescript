import { WorldMap, MapPosition, CanvasClickPublisher, Animal } from '../model';

type CanvasPosition = [number, number];
export const CanvasController = new (class CanvasController extends CanvasClickPublisher {
  private static readonly CANVAS_SELECTOR = '#canvas';
  private static readonly CANVAS_CONTAINER_SELECTOR = '#canvas-container';

  private readonly canvas: HTMLCanvasElement = document.querySelector(
    CanvasController.CANVAS_SELECTOR
  ) as HTMLCanvasElement;
  private readonly container: HTMLDivElement = document.querySelector(
    CanvasController.CANVAS_CONTAINER_SELECTOR
  ) as HTMLDivElement;

  private readonly context2d: CanvasRenderingContext2D;

  // these will be set by handleResize() method.
  private cellWidth = 0;
  private cellHeight = 0;

  private map: WorldMap | null = null;
  private highlightedAnimal: Animal | null = null;

  constructor() {
    super();
    const context = this.canvas.getContext('2d');
    if (!context) throw new ReferenceError('Cannot get canvas context');
    this.context2d = context;

    this.context2d.textAlign = 'center';
    this.context2d.textBaseline = 'middle';
  }

  init(map: WorldMap): void {
    this.map = map;
    this.handleResize();
    this.attachListeners();
  }

  update(): void {
    this.clear();
    this.drawCells();
    this.drawBorders();
  }

  setHighlightedAnimal(animal: Animal): void {
    this.highlightedAnimal = animal;
  }

  private attachListeners() {
    window.addEventListener('resize', () => {
      this.handleResize();
      this.update();
    });
    this.canvas.addEventListener('click', e => {
      e.stopPropagation();
      const position = this.canvasPosToMapPos([e.offsetX, e.offsetY]);
      this.notifyObservers(position);
      console.log(position);
    });
  }

  private clear(): void {
    this.context2d.fillStyle = 'white';
    this.context2d.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private drawBorders(): void {
    // border around
    this.context2d.beginPath();
    this.context2d.rect(0, 0, this.canvas.width, this.canvas.height);

    // vertical cell borders
    for (let i = this.cellWidth; i < this.canvas.width; i += this.cellWidth) {
      this.context2d.moveTo(i, 0);
      this.context2d.lineTo(i, this.canvas.height);
    }

    // horizontal cell borders
    for (let i = this.cellHeight; i < this.canvas.height; i += this.cellHeight) {
      this.context2d.moveTo(0, i);
      this.context2d.lineTo(this.canvas.width, i);
    }
    this.context2d.stroke();
  }

  private drawCells(): void {
    if (!this.map) return;
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

    const specialPos = this.highlightedAnimal?.position;

    //TODO: change color based on animal energy
    this.map.forEachAnimalCell((animals, position) => {
      this.context2d.fillStyle = position.equals(specialPos) ? 'orange' : 'red';

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

  private mapPosToCanvasPos(mapPos: MapPosition): CanvasPosition {
    return [mapPos.x * this.cellWidth, mapPos.y * this.cellHeight];
  }

  private canvasPosToMapPos([canvasX, canvasY]: CanvasPosition): MapPosition {
    const x = Math.floor(canvasX / this.cellWidth);
    const y = Math.floor(canvasY / this.cellHeight);
    return new MapPosition(x, y);
  }

  private handleResize(): void {
    if (!this.map) return;
    const style = window.getComputedStyle(this.container);
    console.log('style', style.width, style.height);
    // prettier-ignore
    // const [containerWidth, containerHeight] = [style.width, style.height].map(el => parseInt(el));
    const [containerWidth, containerHeight] = [this.container.clientWidth, this.container.clientHeight];
    console.log('container', containerWidth, containerHeight);

    // calculate width and height as a common multiple of window size and map size.
    const height = Math.floor(containerHeight / this.map.height) * this.map.height;
    const width = Math.floor(containerWidth / this.map.width) * this.map.width;

    const mapRatio = this.map.width / this.map.height;
    this.canvas.height = Math.min(width / mapRatio, height);
    this.canvas.width = Math.min(height * mapRatio, width);
    this.cellWidth = Math.floor(this.canvas.width / this.map.width);
    this.cellHeight = Math.floor(this.canvas.height / this.map.height);

    console.log(this.cellHeight, this.cellWidth);
  }

  showCanvas(): void {
    this.container.style.display = '';
  }

  hideCanvas(): void {
    this.container.style.display = 'none';
  }
})();
