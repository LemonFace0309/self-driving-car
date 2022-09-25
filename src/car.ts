class Car {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  acceleration: number;
  maxSpeed: number;
  angle: number;
  friction: number;
  sensor: Sensor;
  controls: Controls;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.speed = 0;
    this.acceleration = 0.4;
    this.maxSpeed = 5;
    this.angle = 0;
    this.friction = 0.05;

    this.sensor = new Sensor(this);
    this.controls = new Controls();
  }

  update(roadBorders: Quadrilateral) {
    this.#move();
    this.sensor.update(roadBorders);
  }

  #createPolygon() {
    const points: Coordinate[] = [];
    const radius = Math.hypot(this.width, this.height) / 2;
    const alpha = Math.atan2(this.width, this.height);

    points.push({
      // top-right corder
      x: this.x - Math.sin(this.angle - alpha) * radius,
      y: this.y - Math.cos(this.angle - alpha) * radius,
    });
  }

  #move() {
    // direction
    if (this.controls.forward) {
      this.speed += this.acceleration;
    }
    if (this.controls.reverse) {
      this.speed -= this.acceleration;
    }
    const flip = this.speed >= 0 ? 1 : -1;
    if (this.controls.left) {
      this.angle += 0.03 * flip;
    }
    if (this.controls.right) {
      this.angle -= 0.03 * flip;
    }

    // limiting speed
    if (this.speed > this.maxSpeed) {
      this.speed = this.maxSpeed;
    }
    if (this.speed < -this.maxSpeed / 2) {
      this.speed = -this.maxSpeed / 2;
    }

    // friction
    if (this.speed > 0) {
      this.speed -= this.friction;
    }
    if (this.speed < 0) {
      this.speed += this.friction;
    }
    // prevents bouncing around
    if (Math.abs(this.speed) < this.friction) {
      this.speed = 0;
    }

    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
  }

  draw(ctx: CanvasRenderingContext2D | null) {
    if (!ctx) return;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(-this.angle);

    ctx.beginPath();
    ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);
    ctx.fill();

    ctx.restore();

    this.sensor.draw(ctx);
  }
}
