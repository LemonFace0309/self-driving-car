if (typeof window !== "undefined") {
  const canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
  canvas.height = window.innerHeight;
  canvas.width = 200;

  const ctx = canvas.getContext("2d");
  const car = new Car(100, 100, 30, 50);
  car.draw(ctx);
}
