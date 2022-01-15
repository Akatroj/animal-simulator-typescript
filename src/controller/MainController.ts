import { SimulationController, ConfigController, CanvasController } from '.';
import { Config, IConfigSubmitObserver } from '../model';

export const MainController = new (class MainController implements IConfigSubmitObserver {
  private static readonly TOGGLE_SIM_BUTTON_SELECTOR = '#toggleSim';
  private static readonly BACK_TO_CFG_BUTTON_SELECTOR = '#backToCfg';

  private readonly toggleSimButton: HTMLButtonElement = document.querySelector(
    MainController.TOGGLE_SIM_BUTTON_SELECTOR
  ) as HTMLButtonElement;
  private readonly backToCfgButton: HTMLButtonElement = document.querySelector(
    MainController.BACK_TO_CFG_BUTTON_SELECTOR
  ) as HTMLButtonElement;

  private config: Config | null = null;
  private ready = false;

  init(): void {
    if (this.ready) return;
    ConfigController.init();
    CanvasController.init();
    SimulationController.init();

    ConfigController.addObserver(this);

    this.attachListeners();
    this.showConfig();
    this.ready = true;
    console.log('ready');
  }

  configSubmitted(config: Config): void {
    this.config = config;
    this.startSimulation();
  }

  startSimulation(): void {
    if (!this.config) return;

    this.showSimulation();
    SimulationController.setConfig(this.config);

    SimulationController.startSimulation();
    this.setButtonText();
  }

  private attachListeners(): void {
    this.toggleSimButton.addEventListener('click', () => {
      SimulationController.toggleSimulation();
      this.setButtonText();
    });

    // TODO: add the ability to hotswap the config without reloading the page
    this.backToCfgButton.addEventListener('click', () => window.location.reload());
  }

  private setButtonText(): void {
    this.toggleSimButton.innerText = SimulationController.running
      ? 'Pause simulation'
      : 'Restart simulation';
  }

  private showSimulation(): void {
    ConfigController.hideForm();
    SimulationController.showSimulation();
  }

  private showConfig(): void {
    SimulationController.hideSimulation();
    ConfigController.showForm();
  }
})();
