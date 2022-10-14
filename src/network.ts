class NeuralNetwork {
  levels: Level[];

  constructor(neuronCounts: number[]) {
    this.levels = [];

    for (let i = 0; i < neuronCounts.length - 1; i++) {
      this.levels.push(new Level(neuronCounts[i], neuronCounts[i + 1]));
    }
  }

  static feedForwrd(givenInputs: number[], network: NeuralNetwork) {
    let outputs = Level.feedForwards(givenInputs, network.levels[0]);
    for (let i = 1; i < network.levels.length; i++) {
      outputs = Level.feedForwards(outputs, network.levels[i]);
    }

    return outputs;
  }

  static mutate(network: NeuralNetwork, amount = 1) {
    network.levels.forEach((level) => {
      for (let i = 0; i < level.biases.length; i++) {
        level.biases[i] = lerp(level.biases[i], randomNodeValue(), amount);
      }
      for (let i = 0; i < level.weights.length; i++) {
        for (let j = 0; j < level.weights[i].length; j++) {
          level.weights[i][j] = lerp(
            level.weights[i][j],
            randomNodeValue(),
            amount
          );
        }
      }
    });
  }
}

class Level {
  inputs: number[];
  outputs: number[];
  biases: number[];
  weights: number[][];

  constructor(inputCount: number, outputCount: number) {
    this.inputs = new Array(inputCount);
    this.outputs = new Array(outputCount);
    this.biases = new Array(outputCount);

    this.weights = [];
    for (let i = 0; i < inputCount; i++) {
      this.weights[i] = new Array(outputCount);
    }

    Level.#randomize(this);
  }

  // static method so object can be serialized
  static #randomize(level: Level) {
    for (let i = 0; i < level.inputs.length; i++) {
      for (let j = 0; j < level.outputs.length; j++) {
        // create value between -1 and 1
        level.weights[i][j] = randomNodeValue();
      }
    }

    for (let i = 0; i < level.biases.length; i++) {
      // create value between -1 and 1
      level.biases[i] = randomNodeValue();
    }
  }

  static feedForwards(givenInputs: number[], level: Level) {
    for (let i = 0; i < givenInputs.length; i++) {
      level.inputs[i] = givenInputs[i];
    }

    // setting values for output neurons
    for (let i = 0; i < level.outputs.length; i++) {
      let sum = 0;
      for (let j = 0; j < level.inputs.length; j++) {
        sum += level.inputs[j] * level.weights[j][i];
      }

      level.outputs[i] = sum > level.biases[i] ? 1 : 0;
    }

    return level.outputs;
  }
}
