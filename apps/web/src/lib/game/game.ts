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
    } 
  | {
      type: "arrow";
      startX: number;
      startY: number;
      endX: number;
      endY: number;
  }

export type DrawingElement = "rect" | "circle" | "line" | "arrow" | "text";

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

  constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket, authToken : string) {
    this.canvas = canvas;
    this.roomId = roomId;
    this.socket = socket;
    this.drawingELement = "rect";
    this.prevShapes = [];
    this.ctx = this.canvas.getContext("2d")!;
    this.clicked = false;
    this.initDraw(authToken);
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

    const selectedShape : DrawingElement = this.drawingELement;
    let shape : Shape | null = null;

    if(selectedShape == "rect"){
        shape = {
            type: "rect",
            x: this.startX,
            y: this.startY,
            height,
            width,
        };
    } else if(selectedShape == "circle"){
        const radius = Math.max(width, height) / 2;
            shape = {
                type: "circle",
                radius: radius,
                centerX: this.startX + radius,
                centerY: this.startY + radius,
            }
    }
    else if(selectedShape == "line"){
            shape = {
                type: "line",
                startX: this.startX,
                startY : this.startY,
                endX : e.clientX,
                endY : e.clientY
            }
    } else if(selectedShape == "arrow"){
        shape = {
                type: "arrow",
                startX: this.startX,
                startY : this.startY,
                endX : e.clientX,
                endY : e.clientY
            }
    } 

 if(!shape) return;
    this.prevShapes.push(shape);
    console.log(this.roomId);
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
      const selectedShape = this.drawingELement;
      if(selectedShape == "rect") {
          this.ctx.strokeRect(this.startX, this.startY, width, height);
      }
      else if(selectedShape == "circle"){
        const radius = Math.max(width, height) / 2;
        const centerX = this.startX + radius;
        const centerY = this.startY + radius;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, Math.abs(radius), 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.closePath();                
      }else if(selectedShape == "line") {
        this.ctx.beginPath();
        this.ctx.moveTo(this.startX, this.startY);
        this.ctx.lineTo( e.clientX, e.clientY);
        this.ctx.stroke()
        this.ctx.closePath();    
      } else if(selectedShape == "arrow"){
        const dx = e.clientX - this.startX;
        const dy = e.clientY - this.startY;
        const headlen = Math.sqrt( dx * dx + dy * dy ) * 0.3; // length of head in pixels
        const angle = Math.atan2( dy, dx );
        this.ctx.beginPath();
        this.ctx.moveTo( this.startX, this.startY );
        this.ctx.lineTo( e.clientX, e.clientY );
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo( e.clientX - headlen * Math.cos( angle - Math.PI / 6 ), e.clientY - headlen * Math.sin( angle - Math.PI / 6 ) );
        this.ctx.lineTo( e.clientX, e.clientY );
        this.ctx.lineTo( e.clientX - headlen * Math.cos( angle + Math.PI / 6 ), e.clientY - headlen * Math.sin( angle + Math.PI / 6 ) );
        this.ctx.stroke();
      }
      
    }
  };

  async initDraw(authToken : string) {
    this.prevShapes = await getExistingShapes(this.roomId, authToken);
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
      if (shape.type === "rect") {
                this.ctx.strokeStyle = "rgba(255, 255, 255)"
                this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        } else if (shape.type === "circle") {
            console.log(shape);
            this.ctx.beginPath();
            this.ctx.arc(shape.centerX, shape.centerY, Math.abs(shape.radius), 0, Math.PI * 2);
            this.ctx.stroke();
            this.ctx.closePath();                
        } else if(shape.type === "line"){
            this.ctx.beginPath();
            this.ctx.moveTo(shape.startX, shape.startY);
            this.ctx.lineTo(shape.endX, shape.endY);
            this.ctx.stroke()
            this.ctx.closePath();    
        } else if (shape.type === "arrow"){
            const dx = shape.endX - shape.startX;
            const dy =shape.endY - shape.startY;
            const headlen = Math.sqrt( dx * dx + dy * dy ) * 0.3; // length of head in pixels
            const angle = Math.atan2( dy, dx );
            this.ctx.beginPath();
            this.ctx.moveTo( shape.startX, shape.startY );
            this.ctx.lineTo( shape.endX, shape.endY );
            this.ctx.stroke();
            this.ctx.beginPath();
            this.ctx.moveTo( shape.endX - headlen * Math.cos( angle - Math.PI / 6 ), shape.endY - headlen * Math.sin( angle - Math.PI / 6 ) );
            this.ctx.lineTo( shape.endX, shape.endY );
            this.ctx.lineTo( shape.endX - headlen * Math.cos( angle + Math.PI / 6 ), shape.endY - headlen * Math.sin( angle + Math.PI / 6 ) );
            this.ctx.stroke();
        }
    });
  };
}
