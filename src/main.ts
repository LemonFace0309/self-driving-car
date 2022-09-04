if (typeof window === "undefined") process.exit();

const canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
canvas.width = 200;

const ctx = canvas.getContext("2d");
const car = new Car(100, 100, 30, 50);
car.draw(ctx);

animate();

function animate() {
  car.update();
  canvas.height = window.innerHeight; // clears canvas
  car.draw(ctx);
  requestAnimationFrame(animate);
}
