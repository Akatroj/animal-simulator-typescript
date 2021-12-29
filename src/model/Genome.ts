import { random, range, shuffle, countBy } from 'lodash';

export type Gene = number;

export class Genome {
  private static readonly GENOME_SIZE = 32;
  private static readonly GENE_POOL_SIZE = 8;

  private readonly geneList: Gene[];

  constructor();
  constructor(parent1: Genome, parent2: Genome);

  constructor(parent1?: Genome, parent2?: Genome) {
    // create a Genome by mixing two parents
    if (parent1 && parent2) {
      const genesFromFirstParent = random(1, Genome.GENOME_SIZE - 1);
      const genesFromSecondParent = Genome.GENOME_SIZE - genesFromFirstParent;
      this.geneList = parent1
        .getRandomGenes(genesFromFirstParent)
        .concat(parent2.getRandomGenes(genesFromSecondParent));
    }
    // no arg constructor - create a random Genome
    else {
      this.geneList = Array.from(
        { length: Genome.GENOME_SIZE },
        () => random(Genome.GENE_POOL_SIZE - 1) as Gene
      );
      this.fixGenome();
    }
  }

  private getRandomGenes(amount: number): Gene[] {
    const result: Gene[] = [];

    // generate "amount" unique random indexes to use
    const temp: number[] = range(0, Genome.GENOME_SIZE);
    const indexesToUse = shuffle(temp);
    indexesToUse.splice(amount);

    indexesToUse.forEach(idx => result.push(this.geneList[idx]));

    return result;
  }

  // if a gene does not exist in the genome, add it at random position
  private fixGenome(): void {
    const geneCount = countBy(this.geneList);

    for (const [key, value] of Object.entries(geneCount)) {
      if (value === 0) {
        // pick the index at random, but ensure that another gene type wont be removed entirely
        let idx = random(Genome.GENOME_SIZE - 1);
        while (geneCount[idx] <= 1) {
          idx = random(Genome.GENOME_SIZE - 1);
        }

        this.geneList[idx] = parseInt(key) as Gene;
      }
    }
  }
}
