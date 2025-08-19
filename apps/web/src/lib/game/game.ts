import { getExistingShapes } from "@/utils";

type Shape =
  | {
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      type: "circle";
      centerX: number;
      centerY: number;
      radius: number;
    }
  | {
      type: "line";
      startX: number;
      startY: number;
      endX: number;
      endY: number;
    };

export type DrawingElement = "rect" | "circle" | "line";

export class Game {
  private canvas: HTMLCanvasElement;
  private roomId: string;
  private socket: WebSocket;
  private drawingELement: DrawingElement;
  private prevShapes: Shape[];
  private ctx: CanvasRenderingContext2D;
  private clicked: boolean;
  private startX: number = 0;
  private startY: number = 0;

  constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    this.canvas = canvas;
    this.roomId = roomId;
    this.socket = socket;
    this.drawingELement = "rect";
    this.prevShapes = [];
    this.ctx = this.canvas.getContext("2d")!;
    this.clicked = false;
    this.initDraw();
    this.initHandle();
    this.handleEvent();
  }

  destroy() {
    this.canvas.removeEventListener("mousedown", this.mouseDown);
    this.canvas.removeEventListener("mouseup", this.mouseUp);
    this.canvas.removeEventListener("mousemove", this.mouseMove);
  }

  setDrawingELement = (type: DrawingElement) => {
    this.drawingELement = type;
  };

  private mouseDown = (e: any) => {
    this.clicked = true;
    this.startX = e.clientX;
    this.startY = e.clientY;
  };

  private mouseUp = (e: any) => {
    this.clicked = false;
    const width = e.clientX - this.startX;
    const height = e.clientY - this.startY;

    let shape: Shape = {
      type: "rect",
      x: this.startX,
      y: this.startY,
      height,
      width,
    };

    this.prevShapes.push(shape);
    this.socket.send(
      JSON.stringify({
        type: "chat",
        message: JSON.stringify({
          shape,
        }),
        roomId: Number(this.roomId),
      })
    );
  };

  private mouseMove = (e: any) => {
    if (this.clicked) {
      this.clearCanvas();
      const width = e.clientX - this.startX;
      const height = e.clientY - this.startY;
      this.ctx.strokeStyle = "rgb(255,255,255)";
      this.ctx.strokeRect(this.startX, this.startY, width, height);
    }
  };

  async initDraw() {
    this.prevShapes = await getExistingShapes(this.roomId);
    this.clearCanvas();
  }

  initHandle = () => {
    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type == "chat") {
        const shape = JSON.parse(message.message);
        this.prevShapes.push(shape.shape);
        this.clearCanvas();
      }
    };
  };

  handleEvent = () => {
    this.canvas.addEventListener("mousedown", this.mouseDown);
    this.canvas.addEventListener("mouseup", this.mouseUp);
    this.canvas.addEventListener("mousemove", this.mouseMove);
  };

  clearCanvas = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "rgb(0,0,0)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.prevShapes.map((shape) => {
      if (shape.type == "rect") {
        this.ctx.strokeStyle = "rgba(255, 255, 255)";
        this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
      }
    });
  };
}
