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
  damaged: boolean;
  polygon?: Coordinate[];
  sensor?: Sensor;
  controls: Controls;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    controlType: "KEYS" | "DUMMY",
    maxSpeed = 5
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.speed = 0;
    this.acceleration = 0.4;
    this.maxSpeed = maxSpeed;
    this.angle = 0;
    this.friction = 0.05;
    this.damaged = false;

    if (controlType != "DUMMY") {
      this.sensor = new Sensor(this);
    }
    this.controls = new Controls(controlType);
  }

  update(roadBorders: Quadrilateral, traffic: Car[]) {
    if (!this.damaged) {
      this.#move();
      this.polygon = this.#createPolygon();
      this.damaged = this.#assessDamage(roadBorders, traffic);
    }
    if (this.sensor) {
      this.sensor.update(roadBorders, traffic);
    }
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

  #createPolygon() {
    const points: Coordinate[] = [];
    const radius = Math.hypot(this.width, this.height) / 2;
    const alpha = Math.atan2(this.width, this.height);

    // top-right corner
    points.push({
      x: this.x - Math.sin(this.angle - alpha) * radius,
      y: this.y - Math.cos(this.angle - alpha) * radius,
    });
    // top-left corner
    points.push({
      x: this.x - Math.sin(this.angle + alpha) * radius,
      y: this.y - Math.cos(this.angle + alpha) * radius,
    });
    // bottom-left corner
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle - alpha) * radius,
      y: this.y - Math.cos(Math.PI + this.angle - alpha) * radius,
    });
    // bottom-right corner
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle + alpha) * radius,
      y: this.y - Math.cos(Math.PI + this.angle + alpha) * radius,
    });
    return points;
  }

  #assessDamage(roadBorders: Quadrilateral, traffic: Car[]) {
    if (!this.polygon) return false;

    for (let i = 0; i < roadBorders.length; i++) {
      if (polysIntersect(this.polygon, roadBorders[i])) {
        return true;
      }
    }

    for (let i = 0; i < traffic.length; i++) {
      if (polysIntersect(this.polygon, traffic[i].polygon as Coordinate[])) {
        return true;
      }
    }
    return false;
  }

  draw(ctx: CanvasRenderingContext2D | null, colour = "black") {
    if (!ctx || !this.polygon) return;

    if (this.damaged) {
      ctx.fillStyle = "gray";
    } else {
      ctx.fillStyle = colour;
    }

    ctx.beginPath();
    ctx.moveTo(this.polygon[0].x, this.polygon[0].y);

    for (let i = 0; i < this.polygon.length; i++) {
      ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
    }
    ctx.fill();

    if (this.sensor) {
      this.sensor.draw(ctx);
    }
  }
}
