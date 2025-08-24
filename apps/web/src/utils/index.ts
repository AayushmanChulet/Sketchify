import { HTTP_BACKEND_URL } from "@repo/config/config";
import Axios from "axios";

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
			startX : number;
			startY : number; 
			endX : number;
			endY : number;
    };

export async function initDraw(
  canvas: HTMLCanvasElement,
  RoomID: string,
  socket: WebSocket,
	type : string
) {
  const ctx = canvas.getContext("2d");
  let prevShapes: Shape[] = await getExistingShapes(RoomID, "test_token_here!!!");

  if (!ctx) return;

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
		console.log("message:   "+ message);
    if (message.type == "chat") {
      const shape = JSON.parse(message.message);
			console.log("here");
			console.log(shape);
      prevShapes.push(shape.shape);
      clearCanvas(prevShapes, canvas, ctx);
    }

		 if (message.type == "chat" && !message.message.includes("shape")) {
    console.log("Chat message received:", message);}
  };

  clearCanvas(prevShapes, canvas, ctx);

  let clicked = false;
  let startX = 0;
  let startY = 0;

  canvas.addEventListener("mousedown", (e) => {
    clicked = true;
    startX = e.clientX;
    startY = e.clientY;
  });

  canvas.addEventListener("mouseup", (e) => {
    clicked = false;
    const width = e.clientX - startX;
    const height = e.clientY - startY;


    let shape: Shape = {
				type: "rect",
				x: startX,
				y: startY,
				height,
				width,
			};

    prevShapes.push(shape);
    socket.send(
      JSON.stringify({
        type: "chat",
        message: JSON.stringify({
          shape,
        }),
        roomId : Number(RoomID),
      })
    );
  });

  canvas.addEventListener("mousemove", (e) => {
    if (clicked) {
      clearCanvas(prevShapes, canvas, ctx);
			const width = e.clientX - startX;
				const height = e.clientY - startY;
				ctx.strokeStyle = "rgb(255,255,255)";
				ctx.strokeRect(startX, startY, width, height);
    }
  });
}

export function clearCanvas(
  prevShapes: Shape[],
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgb(0,0,0)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  prevShapes.map((shape) => {
    if (shape.type == "rect") {
      ctx.strokeStyle = "rgba(255, 255, 255)";
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    }
  });
}

export async function getExistingShapes(roomId: string, authToken:string) {
  const res = await Axios.get(`${HTTP_BACKEND_URL}/api/v1/app/get-chats/${roomId}`, {
		headers : {
			"authorization" : authToken
		}
	});
  const messages = res.data.messages;
  const shapes = messages.map((x: { message: string }) => {
    const messageData = JSON.parse(x.message);
    return messageData.shape;
  });
  return shapes;
}
