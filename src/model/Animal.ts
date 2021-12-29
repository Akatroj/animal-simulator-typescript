import { Genome } from './Genome';

export class Animal {
  public readonly children: Animal[] = [];

  public readonly myGenes: Genome;

  constructor();
  constructor(parent1: Animal, parent2: Animal);

  constructor(parent1?: Animal, parent2?: Animal) {
    if (parent1 && parent2) {
      this.myGenes = new Genome(parent1.myGenes, parent2.myGenes);
    } else {
      this.myGenes = new Genome();
    }
  }
}
