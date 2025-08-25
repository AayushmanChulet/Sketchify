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

export type DrawingElement = "rect" | "circle" | "line" | "arrow" | "text" | "erase";

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
    if (this.drawingELement === "erase") {
      this.handleErase(e.clientX, e.clientY);
      return;
    }
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
      if (this.drawingELement === "erase") {
      // Show visual feedback for erase mode
      this.clearCanvas();
      const shapeIndex = this.findShapeAtPoint(e.clientX, e.clientY);
      if (shapeIndex !== -1) {
        this.highlightShape(this.prevShapes[shapeIndex]);
      }
      return;
    }
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
      } else if (message.type == "erase") {
        const eraseData = JSON.parse(message.message);
        this.prevShapes.splice(eraseData.shapeIndex, 1);
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
            const headlen = Math.sqrt( dx * dx + dy * dy ) * 0.3;
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

  private handleErase = (x: number, y: number) => {
    const shapeToRemove = this.findShapeAtPoint(x, y);
    if (shapeToRemove !== -1) {
      // Remove the shape from local array
      this.prevShapes.splice(shapeToRemove, 1);
      
      // Send erase command to other clients
      this.socket.send(
        JSON.stringify({
          type: "erase",
          message: JSON.stringify({
            shapeIndex: shapeToRemove,
          }),
          roomId: Number(this.roomId),
        })
      );
      
      this.clearCanvas();
    }
  };
  private findShapeAtPoint = (x: number, y: number): number => {
    // Check shapes in reverse order (top to bottom)
    for (let i = this.prevShapes.length - 1; i >= 0; i--) {
      const shape = this.prevShapes[i];
      
      if (this.isPointInShape(x, y, shape)) {
        return i;
      }
    }
    return -1;
  };

  private isPointInShape = (x: number, y: number, shape: Shape): boolean => {
    switch (shape.type) {
      case "rect":
        return x >= shape.x && 
               x <= shape.x + shape.width && 
               y >= shape.y && 
               y <= shape.y + shape.height;
      
      case "circle":
        const distance = Math.sqrt(
          Math.pow(x - shape.centerX, 2) + Math.pow(y - shape.centerY, 2)
        );
        return distance <= Math.abs(shape.radius);
      
      case "line":
      case "arrow":
        // Check if point is near the line (within 10 pixels)
        const lineDistance = this.distanceToLine(
          x, y, 
          shape.startX, shape.startY, 
          shape.endX, shape.endY
        );
        return lineDistance <= 10;
      
      default:
        return false;
    }
  };

  private distanceToLine = (
    px: number, py: number, 
    x1: number, y1: number, 
    x2: number, y2: number
  ): number => {
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    
    if (lenSq === 0) return Math.sqrt(A * A + B * B);
    
    let param = dot / lenSq;
    
    if (param < 0) {
      return Math.sqrt(A * A + B * B);
    } else if (param > 1) {
      const E = px - x2;
      const F = py - y2;
      return Math.sqrt(E * E + F * F);
    } else {
      const closestX = x1 + param * C;
      const closestY = y1 + param * D;
      const dx = px - closestX;
      const dy = py - closestY;
      return Math.sqrt(dx * dx + dy * dy);
    }
  };
  private highlightShape = (shape: Shape) => {
    this.ctx.save();
    this.ctx.strokeStyle = "rgba(255, 0, 0, 0.8)";
    this.ctx.lineWidth = 3;
    
    switch (shape.type) {
      case "rect":
        this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        break;
      case "circle":
        this.ctx.beginPath();
        this.ctx.arc(shape.centerX, shape.centerY, Math.abs(shape.radius), 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.closePath();
        break;
      case "line":
        this.ctx.beginPath();
        this.ctx.moveTo(shape.startX, shape.startY);
        this.ctx.lineTo(shape.endX, shape.endY);
        this.ctx.stroke();
        this.ctx.closePath();
        break;
      case "arrow":
        const dx = shape.endX - shape.startX;
        const dy = shape.endY - shape.startY;
        const headlen = Math.sqrt(dx * dx + dy * dy) * 0.3;
        const angle = Math.atan2(dy, dx);
        
        this.ctx.beginPath();
        this.ctx.moveTo(shape.startX, shape.startY);
        this.ctx.lineTo(shape.endX, shape.endY);
        this.ctx.stroke();
        
        this.ctx.beginPath();
        this.ctx.moveTo(shape.endX - headlen * Math.cos(angle - Math.PI / 6), shape.endY - headlen * Math.sin(angle - Math.PI / 6));
        this.ctx.lineTo(shape.endX, shape.endY);
        this.ctx.lineTo(shape.endX - headlen * Math.cos(angle + Math.PI / 6), shape.endY - headlen * Math.sin(angle + Math.PI / 6));
        this.ctx.stroke();
        break;
    }
    
    this.ctx.restore();
  };
}


