import {
  CanvasController,
  ConfigController,
  GlobalStatsController,
  AnimalStatsController,
} from '.';
import {
  Animal,
  Config,
  IConfigSubmitObserver,
  MapPosition,
  SimulationEngine,
  ICanvasClickObserver,
} from '../model';

// static class implementing interface hack
export const SimulationController = new (class SimulationController
  implements IConfigSubmitObserver, ICanvasClickObserver
{
  private static readonly SIMULATION_CONTAINER_SELECTOR = '#simulation-container';
  private readonly simulationContainer = document.querySelector(
    SimulationController.SIMULATION_CONTAINER_SELECTOR
  ) as HTMLDivElement;

  private simulationEngine: SimulationEngine | null = null;
  private config: Config | null = null;
  private _running = false;
  private lastUpdate = 0;

  init(): void {
    this.hideSimulation();
    ConfigController.init();
    ConfigController.addObserver(this);
    CanvasController.addObserver(this);
  }

  configSubmitted(config: Config): void {
    this.config = config;
    this.simulationEngine = new SimulationEngine(config);
    GlobalStatsController.setEngine(this.simulationEngine);

    ConfigController.hideForm();
    this.showSimulation();
    CanvasController.init(this.simulationEngine.map); // IMPORTANT: init after the canvas element is visible

    this.startSimulation();
  }

  canvasClicked(pos: MapPosition): void {
    const entity = this.simulationEngine?.map.objectAtPosition(pos);
    if (entity instanceof Animal) {
      const name = window.prompt('Enter a name for the selected animal.');
      AnimalStatsController.setAnimal(entity, name);
      AnimalStatsController.update();
      CanvasController.setHighlightedAnimal(entity);
    }
  }

  get running(): boolean {
    return this._running;
  }

  private stopSimulation(): void {
    this._running = false;
    window.alert('All animals are dead.');
  }

  private startSimulation(): void {
    this._running = true;
    window.requestAnimationFrame(() => this.update(performance.now()));
  }

  private nextStep(): void {
    if (this.simulationEngine?.aliveAnimals === 0) this.stopSimulation();
    this.simulationEngine?.nextDay();
    CanvasController.update();
    GlobalStatsController.update();
    AnimalStatsController.update();
  }

  private update(time: DOMHighResTimeStamp): void {
    if (!this._running || !this.config) return;
    window.requestAnimationFrame(time => this.update(time));
    if (time - this.lastUpdate > this.config.dayLength) {
      this.lastUpdate = time;
      this.nextStep();
    }
  }

  private showSimulation(): void {
    this.simulationContainer.style.display = '';
  }

  private hideSimulation(): void {
    this.simulationContainer.style.display = 'none';
  }
})();
