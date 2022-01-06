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

export type SimulationDate = number;
export type Energy = number;
