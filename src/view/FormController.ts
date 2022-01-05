import { Energy } from '../model/WorldMap';

export class ConfigController {
  public static readonly DEFAULT: Config = {
    width: 10,
    height: 10,
    startEnergy: 100,
    jungleRatio: 0.3,
    energyPassedToChild: 0.5,
    moveEnergy: 1,
    startAnimalCount: 10,
    grassEnergy: 100,
    dayLength: 1000,
  } as const;

  // TODO: public?
  private static readonly FORM_CONTAINER_NAME = '.form-container.container';
  private static readonly FORM_NAME = '#config';

  // TODO: zamienic klase na inline funkcje?

  private readonly form: HTMLFormElement;
  private readonly formContainer: HTMLDivElement;
  private _config: Config;

  constructor() {
    this.form = document.querySelector(ConfigController.FORM_NAME) as HTMLFormElement;
    this.formContainer = document.querySelector(
      ConfigController.FORM_CONTAINER_NAME
    ) as HTMLDivElement;

    const configString = localStorage.getItem('config');
    this._config = configString ? JSON.parse(configString) : ConfigController.DEFAULT;

    this.fillForm();
    this.attachListener();
  }

  private saveConfig(): void {
    localStorage.setItem('config', JSON.stringify(this.config));
  }

  private fillForm(): void {
    Object.entries(this._config).forEach(([key, value]) => {
      const inputEl = document.querySelector(`input[name=${key}]`) as HTMLInputElement;
      inputEl.value = `${value}`;
    });
  }

  private attachListener(): void {
    this.form.addEventListener('submit', e => {
      e.preventDefault();
      const formEntries: Config = Object.fromEntries(
        new FormData(this.form).entries()
      ) as unknown as Config;

      this._config = formEntries;
      console.log(this._config);
      this.saveConfig();

      this.formContainer.style.display = 'none';
      // TODO: to jest kurwa brzydkie, moze to wyciagnac z klasy canvasView, albo wymyślić jakiś łącznik
      const canvasContainer = document.querySelector('#canvas-container') as HTMLDivElement;
      canvasContainer.style.display = '';
    });
  }

  get config(): Config {
    return this._config;
  }
}

export interface Config {
  width: number;
  height: number;
  startEnergy: Energy;
  energyPassedToChild: number;
  jungleRatio: number;
  moveEnergy: Energy;
  startAnimalCount: number;
  grassEnergy: Energy;
  dayLength: number;
}
