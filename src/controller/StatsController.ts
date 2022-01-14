import { Animal, SimulationEngine } from '../model';

export const GlobalStatsController = new (class GlobalStatsController {
  private static readonly SIMULATION_DATE_SELECTOR = '#date';
  private static readonly ALIVE_ANIMALS_SELECTOR = '#alive';
  private static readonly DOMINATING_GENOME_SELECTOR = '#genome';
  private static readonly AVERAGE_LIFESPAN_SELECTOR = '#lifespan';

  private readonly simualtionDateSpan: HTMLSpanElement = document.querySelector(
    GlobalStatsController.SIMULATION_DATE_SELECTOR
  ) as HTMLSpanElement;
  private readonly aliveAnimalsSpan: HTMLSpanElement = document.querySelector(
    GlobalStatsController.ALIVE_ANIMALS_SELECTOR
  ) as HTMLSpanElement;
  private readonly dominatingGenomeSpan: HTMLSpanElement = document.querySelector(
    GlobalStatsController.DOMINATING_GENOME_SELECTOR
  ) as HTMLSpanElement;
  private readonly averageLifespanSpan: HTMLSpanElement = document.querySelector(
    GlobalStatsController.AVERAGE_LIFESPAN_SELECTOR
  ) as HTMLSpanElement;

  private readonly simulationDate = () => `Day: ${this.engine?.map.today ?? 0}`;
  private readonly animalsAlive = () =>
    `Animals alive curently: ${this.engine?.aliveAnimals ?? 0}`;
  private readonly dominatingGenome = () =>
    `Dominating genome: ${this.engine?.dominatingGenome ?? 'none'}`;
  private readonly averageLifespan = () =>
    `Average animal lifespan: ${this.engine?.averageAnimalDeathAge.toFixed(2) ?? 0}`;

  private engine: SimulationEngine | null = null;

  setEngine(engine: SimulationEngine): void {
    this.engine = engine;
    this.update();
  }

  update(): void {
    this.simualtionDateSpan.innerText = this.simulationDate();
    this.aliveAnimalsSpan.innerText = this.animalsAlive();
    this.dominatingGenomeSpan.innerText = this.dominatingGenome();
    this.averageLifespanSpan.innerText = this.averageLifespan();
  }
})();

export const AnimalStatsController = new (class AnimalStatsController {
  private static readonly DEFAULT_NAME = 'Mariusz';

  private static readonly ANIMAL_NAME_SELECTOR = '#animalName';
  private static readonly SELECTED_GENOME_SELECTOR = '#selectedGenome';
  private static readonly CHILDREN_COUNT_SELECTOR = '#childrenCount';
  private static readonly ANIMAL_STATUS_SELECTOR = '#status';
  private static readonly ANIMAL_ENERGY_SELECTOR = '#energy';

  private readonly animalNameSpan: HTMLSpanElement = document.querySelector(
    AnimalStatsController.ANIMAL_NAME_SELECTOR
  ) as HTMLSpanElement;
  private readonly selectedGenomeSpan: HTMLSpanElement = document.querySelector(
    AnimalStatsController.SELECTED_GENOME_SELECTOR
  ) as HTMLSpanElement;
  private readonly childrenCountSpan: HTMLSpanElement = document.querySelector(
    AnimalStatsController.CHILDREN_COUNT_SELECTOR
  ) as HTMLSpanElement;
  private readonly animalStatusSpan: HTMLSpanElement = document.querySelector(
    AnimalStatsController.ANIMAL_STATUS_SELECTOR
  ) as HTMLSpanElement;

  private readonly animalEnergySpan: HTMLSpanElement = document.querySelector(
    AnimalStatsController.ANIMAL_ENERGY_SELECTOR
  ) as HTMLSpanElement;

  private readonly animalName = () => `Selected animal: ${this.name}`;
  private readonly animalGenome = () =>
    `Genome: ${this._selectedAnimal?.myGenes.toString() ?? 'none'}`;
  private readonly animalChildrenCount = () =>
    `Children count: ${this._selectedAnimal?.childCount ?? 0}`;
  private readonly animalStatus = () =>
    `Status: ${this._selectedAnimal?.isDead ? 'dead' : 'alive'}`;
  private readonly animalEnergy = () => `Energy: ${this._selectedAnimal?.energy ?? 0}`;

  private _selectedAnimal: Animal | null = null;
  private name = 'None';

  update(): void {
    this.animalNameSpan.innerText = this.animalName();
    this.selectedGenomeSpan.innerText = this.animalGenome();
    this.childrenCountSpan.innerText = this.animalChildrenCount();
    this.animalStatusSpan.innerText = this.animalStatus();
    this.animalEnergySpan.innerText = this.animalEnergy();
  }

  setAnimal(animal: Animal, name: string | null): void {
    this._selectedAnimal = animal;
    this.name = name || AnimalStatsController.DEFAULT_NAME;
    this.update();
  }

  get selectedAnimal(): Animal | null {
    return this._selectedAnimal;
  }
})();
