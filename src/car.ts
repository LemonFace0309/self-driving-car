class Car {
  x: number;
  y: number;
  width: number;
  height: number;
  controls: Controls;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.controls = new Controls();
  }

  draw(ctx: CanvasRenderingContext2D | null) {
    if (!ctx) return;

    ctx.beginPath();
    ctx.rect(
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height
    );
    ctx.fill();
  }
}
