import { Config, ConfigSubmitPublisher } from '../model';

export const ConfigController = new (class ConfigController extends ConfigSubmitPublisher {
  private static readonly DEFAULT: Config = {
    width: 10,
    height: 10,
    startEnergy: 100,
    jungleRatio: 0.3,
    energyPassedToChild: 0.5,
    moveEnergy: 10,
    startAnimalCount: 10,
    grassEnergy: 70,
    dayLength: 1000,
  } as const;

  private static readonly FORM_CONTAINER_SELECTOR = '#form-container';
  private static readonly FORM_SELECTOR = '#config';
  private static readonly CONFIG_LS_KEY = 'config';

  private static readonly form: HTMLFormElement = document.querySelector(
    ConfigController.FORM_SELECTOR
  ) as HTMLFormElement;

  private static readonly formContainer: HTMLDivElement = document.querySelector(
    ConfigController.FORM_CONTAINER_SELECTOR
  ) as HTMLDivElement;

  private config: Config;

  constructor() {
    super();
    const configString = localStorage.getItem(ConfigController.CONFIG_LS_KEY);
    this.config = configString ? JSON.parse(configString) : ConfigController.DEFAULT;
  }

  init(): void {
    this.fillForm();
    this.attachListener();
  }

  private saveConfig(): void {
    localStorage.setItem(ConfigController.CONFIG_LS_KEY, JSON.stringify(this.config));
  }

  private fillForm(): void {
    Object.entries(this.config).forEach(([key, value]) => {
      const inputEl = document.querySelector(`input[name=${key}]`) as HTMLInputElement;
      inputEl.value = `${value}`;
    });
  }

  private attachListener(): void {
    ConfigController.form.addEventListener('submit', e => {
      e.preventDefault();
      const formData = new FormData(ConfigController.form);

      this.config = {
        width: Number(formData.get('width')),
        height: Number(formData.get('height')),
        startEnergy: Number(formData.get('startEnergy')),
        energyPassedToChild: Number(formData.get('energyPassedToChild')),
        jungleRatio: Number(formData.get('jungleRatio')),
        moveEnergy: Number(formData.get('moveEnergy')),
        startAnimalCount: Number(formData.get('startAnimalCount')),
        grassEnergy: Number(formData.get('grassEnergy')),
        dayLength: Number(formData.get('dayLength')),
      };

      console.log(this.config);
      this.saveConfig();
      this.notifyObservers(this.config);
    });
  }

  showForm(): void {
    ConfigController.formContainer.style.display = '';
  }

  hideForm(): void {
    ConfigController.formContainer.style.display = 'none';
  }
})();
