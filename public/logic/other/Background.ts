namespace Background {
  class Circle {
    private x: number;
    private y: number;
    private dx: number;
    private dy: number;
    private minRadius: number;
    private radius: number;
    private color: string;

    constructor(
      x: number, y: number, dx: number,
      dy: number, radius: number, color: string
    ) {

      this.x = x;
      this.y = y;
      this.dx = dx;
      this.dy = dy;
      this.minRadius = this.radius = radius;
      this.color = color;
    }

    positionX(): number {
      return this.x;
    }

    positionY(): number {
      return this.y;
    }

    r(): number {
      return this.radius;
    }

    rMin(): number {
      return this.minRadius;
    }

    update(dimension: string): Circle {
      // Reverse x speed of circle if it is on the of the egde of screen
      if (this.x <= 0 || this.x >= window.innerWidth) this.dx *= -1;
      // Update x position
      this.x += this.dx;
      // Reverse y speed of circle if it is on the of the egde of screen
      if (this.y <= 0 || this.y >= window.innerHeight) this.dy *= -1;
      // Update y position
      this.y += this.dy;

      switch (dimension) {
        case "grow":
          this.radius++;
          break;
        case "diminish":
          this.radius--;
          break;
      }

      return this;
    }

    draw(): Circle {
      const canvas: HTMLCanvasElement = <HTMLCanvasElement>
        $("#animationCanvas")[0];

      const ctx: CanvasRenderingContext2D = canvas.getContext("2d");

      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();

      return this;
    }

    static random(): Circle {
      const colors: string[] = [
        "#29313e",
        "#2f5567",
        "#ffcb3f",
        "#d04931"
      ];
      const radius: number = Math.floor((Math.random() * 2) + 3);
      const x: number = (
        Math.random() * (window.innerWidth - radius * 2)
      ) + radius;
      const y: number = (
        Math.random() * (window.innerHeight - radius * 2)
      ) + radius;
      const dx: number = Math.random() < 0.5 ?
        Math.random() * 2 :
        Math.random() * -2;
      const dy: number = Math.random() < 0.5 ?
        Math.random() * 2 :
        Math.random() * -2;

      return new Circle(
        x,
        y,
        dx,
        dy,
        radius,
        colors[Math.floor(Math.random() * colors.length)]
      );
    }
  }

  export class Animation {
    private updateTimer: NodeJS.Timeout;
    private refreshRate: number;
    private circles: Set<Circle>;
    private maxRadius: number;
    private growthRange: number;
    private mouseX: number;
    private mouseY: number;

    constructor() {
      this.updateTimer;
      // refresh rate: 33 for 30fps, 16 for 60fps, 8 for 120fps
      this.refreshRate = 16;
      this.circles = new Set();
      this.maxRadius = 50;
      this.growthRange = 50;
      this.mouseX = <number>undefined;
      this.mouseY = <number>undefined;
      this.setup(); // setup
    }

    // Fill animation set with circles
    setupCircles(num?: number): Animation {
      this.circles.clear();

      const defaultNum: number = Math.sqrt(
        Math.pow(window.innerHeight, 2) * Math.pow(window.innerWidth, 2)
      ) / 1000;

      num = num ||
        defaultNum < 1200 ?
        defaultNum :
        1200;

      for (let i = 0; i < num; i++) {
        this.circles.add(Circle.random());
      }

      return this;
    }

    setup(): void { // setup animation
      this
        .setupCircles()
        .init();

      $(window)
        .resize(() => {
          this
            .setupCircles()
            .init();
        })
        .mousemove((event: JQuery.Event) => {
          if (
            event.clientX < 0 ||
            event.clientX > window.innerWidth ||
            event.clientY < 0 ||
            event.clientY > window.innerHeight
          ) {

            this.mouseX = <number>undefined;
            this.mouseY = <number>undefined;
          } else {
            this.mouseX = event.clientX;
            this.mouseY = event.clientY;
          }
        });
    }

    // Circles update and draw
    updateFrame() {
      const canvas: HTMLCanvasElement = <HTMLCanvasElement>
        $("#animationCanvas")[0];

      let ctx: CanvasRenderingContext2D = canvas.getContext("2d");

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      this.circles.forEach((circle: Circle) => {
        let dimension: string;

        if (
          circle.r() <= this.maxRadius &&
          circle.positionX() - this.mouseX < this.growthRange &&
          circle.positionX() - this.mouseX > -this.growthRange &&
          circle.positionY() - this.mouseY < this.growthRange &&
          circle.positionY() - this.mouseY > -this.growthRange
        ) {
          dimension = "grow"
        } else if (circle.r() > circle.rMin()) {
          dimension = "diminish"
        }

        circle
          .update(dimension)
          .draw();
      });
    }

    // Initialize animation area and refresh timer
    init(): Animation {
      $("body")
        .css({
          margin: "0",
          width: window.innerWidth,
          overflow: "auto"
        });

      $("#animationCanvas")
        .attr({ width: window.innerWidth, height: window.innerHeight })
        .css({
          "position": "fixed",
          "left": "0px",
          "top": "0px",
          "z-index": "-5",
          "background-color": "#fbe6c0"
        });

      // Set timer for animation refresh
      clearInterval(this.updateTimer);
      this.updateTimer = setInterval(() => {
        this.updateFrame();
      }, this.refreshRate);

      return this;
    }
  }
}