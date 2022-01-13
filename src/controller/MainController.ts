import { SimulationEngine } from '../model/SimulationEngine';
import { Config, IConfigSubmitObserver } from '../model';
import { ConfigController } from './ConfigFormController';
import { CanvasView } from './CanvasController';

// static class implementing interface hack
export const MainController = new (class MainController implements IConfigSubmitObserver {
  private static readonly CONTAINER_NAME = '#simulation-container';
  private readonly container = document.querySelector(
    MainController.CONTAINER_NAME
  ) as HTMLDivElement;
  private formController: ConfigController | null = null;
  private simulationController: SimulationEngine | null = null;
  private canvasController: CanvasView | null = null;
  private config: Config | null = null;
  private _running = false;
  private lastUpdate = 0;

  init(): void {
    this.formController = new ConfigController();
    this.formController.addObserver(this);
    this.hide();
  }

  formSubmitted(config: Config): void {
    this.config = config;
    ConfigController.hideForm();
    this.show(); // TODO: SYFFFFFFFFFFF
    this.simulationController = new SimulationEngine(config);
    this.canvasController = new CanvasView(this.simulationController.map);

    this.start();
  }

  get running(): boolean {
    return this._running;
  }

  private stop(): void {
    this._running = false;
  }

  private start(): void {
    this._running = true;
    window.requestAnimationFrame(() => this.update(performance.now()));
  }

  private nextStep(): void {
    this.simulationController?.nextDay();
    this.canvasController?.drawMap();
  }

  private update(time: DOMHighResTimeStamp): void {
    if (!this._running || !this.config) return;
    window.requestAnimationFrame(time => this.update(time));
    if (time - this.lastUpdate > this.config.dayLength) {
      this.lastUpdate = time;
      this.nextStep();
    }
  }

  private show(): void {
    this.container.style.display = '';
  }

  private hide(): void {
    this.container.style.display = 'none';
  }
})();
