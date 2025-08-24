"use client";
import { WS_BACKEND_URL } from "@repo/config/config";
import { useEffect, useState } from "react";
import Canvas from "./canvas";

export default function RoomCanvas({roomId} : {roomId : string}){
    const [socket , setSocket] = useState<WebSocket | null>(null);
    useEffect(() => {
        //token
        const ws = new WebSocket(`${WS_BACKEND_URL}/?Authorization=${localStorage.getItem("authorization")?.split(" ")[1]}`);
        
        ws.onopen = () => {
            setSocket(ws);
            const req = JSON.stringify({
                type : "join_room",
                roomId : Number(roomId),
            })

            ws.send(req);
        }
    }, [])


    if (!socket) {
        return <div>
            Connecting to server....
        </div>
    }

    return <div>
        <Canvas roomId={roomId} socket={socket} />
    </div>
}