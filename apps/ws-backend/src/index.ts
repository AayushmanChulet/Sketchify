import websocket, { WebSocketServer } from 'ws';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from "@repo/backend/config"

const wss = new WebSocketServer({
    port:8080
})

wss.on('error', console.error);

wss.on("connection", (ws, request) => {

    const url = request.url;

    if(!url) return;

    const queryParams = new URLSearchParams(url.split("?")[1]);
    const token = queryParams.get("Authorization")|| "";

    const decode = jwt.verify(token, JWT_SECRET);

    if(!decode || !(decode as JwtPayload).userId){
        ws.close();
        return
    }

    ws.on("message", (event)=>{
     ws.send("pong : " + event.toString());
    })
})