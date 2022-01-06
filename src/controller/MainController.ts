import { SimulationController } from './SimulationController';
import { Config, IConfigSubmitObserver } from '../model';
import { ConfigController } from './ConfigFormController';
import { CanvasView } from './CanvasController';

type Interval = ReturnType<typeof setInterval>;

export class MainController implements IConfigSubmitObserver {
  private formController: ConfigController | null = null;
  private simulationController: SimulationController | null = null;
  private canvasController: CanvasView | null = null;
  private config: Config | null = null;
  private interval: Interval | null = null;

  formSubmitted(config: Config): void {
    this.config = config;
    ConfigController.hideForm();
    CanvasView.showCanvas();
    this.simulationController = new SimulationController(config);
    this.canvasController = new CanvasView(this.simulationController.map);

    this.restart();
  }

  get running(): boolean {
    return this.interval !== null;
  }

  restart(): void {
    if (this.config === null) return;
    this.nextStep();
    this.interval = setInterval(() => this.nextStep(), this.config.dayLength);
  }

  stop(): void {
    if (this.interval === null) return;
    clearInterval(this.interval);
  }

  start(): void {
    this.formController = new ConfigController();
    this.formController.addObserver(this);
    CanvasView.hideCanvas();
  }

  private nextStep(): void {
    this.simulationController?.nextDay();
    this.canvasController?.drawMap();
  }
}
