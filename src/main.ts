if (typeof window === "undefined") process.exit();

const carCanvas = document.getElementById("carCanvas") as HTMLCanvasElement;
carCanvas.width = 200;

const networkCanvas = document.getElementById(
  "networkCanvas"
) as HTMLCanvasElement;
networkCanvas.width = 200;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);

const cars = generateCars(500);
let bestCar = cars[0];
const bestBrain = localStorage.getItem("bestBrain");
if (bestBrain) {
  for (let i = 0; i < cars.length; i++) {
    cars[i].brain = JSON.parse(bestBrain);

    const brain = cars[i].brain;
    if (i != 0 && brain) {
      NeuralNetwork.mutate(brain, 0.05);
    }
  }
}

const traffic = [...Array(100)].map(
  (_, i) =>
    new Car(
      road.getLaneCenter(Math.floor(Math.random() * 3)),
      -200 * (i + Math.floor(Math.random() * 3)),
      30,
      50,
      "DUMMY",
      Math.floor(Math.random() * 3) + 1
    )
);
// const traffic = [
//   new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 3),
//   new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 3),
//   new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 3),
//   new Car(road.getLaneCenter(1), -600, 30, 50, "DUMMY", 3),
//   new Car(road.getLaneCenter(0), -800, 30, 50, "DUMMY", 3),
//   new Car(road.getLaneCenter(1), -800, 30, 50, "DUMMY", 3),
//   new Car(road.getLaneCenter(1), -1000, 30, 50, "DUMMY", 3),
//   new Car(road.getLaneCenter(2), -1000, 30, 50, "DUMMY", 3),
//   new Car(road.getLaneCenter(1), -1300, 30, 50, "DUMMY", 3),
// ];

animate();

function save() {
  localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

function discard() {
  localStorage.removeItem("bestBrain");
}

function generateCars(N: number) {
  const cars: Car[] = [];

  for (let i = 0; i < N; i++) {
    cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
  }

  return cars;
}

function animate(time?: number) {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }
  for (let i = 0; i < cars.length; i++) {
    cars[i].update(road.borders, traffic);
  }

  const carYValues = cars.map((car) => car.y);
  bestCar = cars.find((car) => car.y == Math.min(...carYValues)) ?? bestCar;

  carCanvas.height = window.innerHeight; // clears canvas
  networkCanvas.height = window.innerHeight; // clears canvas

  carCtx?.save();
  carCtx?.translate(0, -bestCar.y + carCanvas.height * 0.7);

  road.draw(carCtx);
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx, "red");
  }
  // Decreases the transparency
  if (carCtx) {
    carCtx.globalAlpha = 0.2;
    for (let i = 1; i < cars.length; i++) {
      cars[i].draw(carCtx, "blue");
    }
    carCtx.globalAlpha = 1;
  }
  bestCar.draw(carCtx, "blue", true);

  carCtx?.restore();

  if (time && networkCtx) {
    networkCtx.lineDashOffset = -(time ?? 0) / 50;
  }
  if (networkCtx && bestCar.brain) {
    Visualizer.drawNetwork(networkCtx, bestCar.brain);
  }

  requestAnimationFrame(animate);
}
