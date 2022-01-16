# animal-simulator-typescript
You can play the simulation [here](https://akatroj.github.io/animal-simulator-typescript/)

# About
This is an idle game about animal evolution. Each day, every animal:

* Rotates to a random direction (with the probability for each rotation encoded in it's genome),
* Moves in the direction it's facing.
* If it's standing on a grassy square it feasts and gains energy.
* If there's another animal on the same square, and both have enough energy they breed and a child is created - the child's energy is stolen from both parents.

If an animal doesn't have enough energy to move, it dies and is removed from the simulation.
Each day, grass grows on 2 squares - with the jungle being a more probable location.

You can click on an animal to give it a name and track his life. The animal's location will be highlighted in orange and information like
current energy, amount of children and more will be displayed below. 

This project is based on [this idea.](https://github.com/apohllo/obiektowe-lab/tree/master/proj1) (description in polish)

# Details
You can input configuration parameters through a HTML form. They are saved in your localStorage for future use.
When the configuration is submitted, a simulation is started.
* Squares containing animals are colored in red.
* Squares with grass are colored in dark green.
* Jungle area is colored in lime green.
* Square with the tracked animal is colored in orange.

### Special rules
There are special rules when a square has several animals in it:
* When clicked, the animal with highest energy is selected for tracking.
* When the square has grass on it, only the strongest animal can eat it. Survival of the fittest.
* When there are more than 2 animals eligible for breeding, only the two with highest energy will be selected. 

### Genome interpretation
There are 8 cardinal directions. When the animal is created, it faces a random direction.
Every day it rotates from it's current orientation to a new one, offset by `x` steps from the previous one:
* a rotation of 2 means rotating 90 degrees clockwise
* a rotation of 4 means rotating 180 degrees
* a rotation of 0 means no rotation.
![Rotation explanation](https://github.com/Akatroj/animal-simulator-typescript/blob/resources/resources/kierunki.jpg?raw=true)


# Configuration
Available parameters:

|      Parameter      |                                      Description                                     |
|:-------------------:|:------------------------------------------------------------------------------------:|
|        width        |                Defines how many squares does the map span horizontally               |
|        height       |                 Defines how many squares does the map span vertically                |
|     startEnergy     |          Defines how much energy is given to each initially spawned animal.          |
| energyPassedToChild |  Defines how much energy (in %) is transferred from each parent to a newborn child.  |
|     jungleRatio     |             Defines how much (in %) of the map is covered by the jungle.             |
|      moveEnergy     | Defines the energy an animal has to spend to move. If it's energy is lower, it dies. |
|  startAnimalsCount  |      Defines how many animals are initially spawned when the simulation begins.      |
|     grassEnergy     |                 Defines how much energy is gained from eating grass.                 |
|      dayLength      |      Defines the time delta (in miliseconds) between each simulation step (day).     |



# Development
You can clone this repository by running 
```
git clone https://github.com/Akatroj/animal-simulator-typescript.git
```

Install the npm dependecies:

```
npm install
```

This project uses parceljs. You can start a dev server on `localhost:1234` by running:

```
npm start
```
