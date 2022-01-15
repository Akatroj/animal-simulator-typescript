import { CanvasController, GlobalStatsController, AnimalStatsController } from '.';
import { Animal, Config, MapPosition, SimulationEngine, ICanvasClickObserver } from '../model';

// static class implementing interface hack
export const SimulationController = new (class SimulationController
  implements ICanvasClickObserver
{
  private static readonly SIMULATION_CONTAINER_SELECTOR = '#simulation-container';
  private readonly simulationContainer = document.querySelector(
    SimulationController.SIMULATION_CONTAINER_SELECTOR
  ) as HTMLDivElement;

  private simulationEngine: SimulationEngine | null = null;
  private config: Config | null = null;
  private _running = false;
  private lastUpdate = 0;
  private ready = false;

  init(): void {
    if (this.ready) return;
    this.hideSimulation();
    CanvasController.addObserver(this);
    this.ready = true;
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

  setConfig(config: Config): void {
    this.config = config;
    this.simulationEngine = new SimulationEngine(config);
    CanvasController.setMap(this.simulationEngine.map);
    GlobalStatsController.setEngine(this.simulationEngine);
  }

  get running(): boolean {
    return this._running;
  }

  showSimulation(): void {
    this.simulationContainer.style.display = '';
  }

  hideSimulation(): void {
    this.simulationContainer.style.display = 'none';
  }

  startSimulation(): void {
    if (!this.ready || !this.simulationEngine) return;
    this._running = true;
    window.requestAnimationFrame(() => this.update(performance.now()));
  }

  pauseSimulation(): void {
    this._running = false;
  }

  toggleSimulation(): void {
    if (this._running) this.pauseSimulation();
    else this.startSimulation();
  }

  private stopSimulation(): void {
    this.pauseSimulation();
    window.alert('All animals are dead.');
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
})();
