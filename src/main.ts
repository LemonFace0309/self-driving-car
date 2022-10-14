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
const car = new Car(road.getLaneCenter(1), 100, 30, 50, "AI");
const traffic = [new Car(road.getLaneCenter(1), -11, 30, 50, "DUMMY", 3)];
car.draw(carCtx);

animate();

function animate(time?: number) {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }

  car.update(road.borders, traffic);
  carCanvas.height = window.innerHeight; // clears canvas
  networkCanvas.height = window.innerHeight; // clears canvas

  carCtx?.save();
  carCtx?.translate(0, -car.y + carCanvas.height * 0.7);

  road.draw(carCtx);
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx, "red");
  }
  car.draw(carCtx, "blue");

  carCtx?.restore();

  if (time && networkCtx) {
    networkCtx.lineDashOffset = -(time ?? 0) / 50;
  }
  if (networkCtx && car.brain) {
    Visualizer.drawNetwork(networkCtx, car.brain);
  }

  requestAnimationFrame(animate);
}
