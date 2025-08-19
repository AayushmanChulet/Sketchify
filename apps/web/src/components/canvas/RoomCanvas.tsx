"use client";
import { WS_BACKEND_URL } from "@repo/config/config";
import { useEffect, useState } from "react";
import Canvas from "./canvas";

export default function RoomCanvas({roomId} : {roomId : string}){
    const [socket , setSocket] = useState<WebSocket | null>(null);
    useEffect(() => {
        //token
        const ws = new WebSocket(`${WS_BACKEND_URL}/?Authorization=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTYxODg3MzEsImRhdGEiOiI4OTQ5MDk0MS1jY2E5LTQ4NmYtOWYxZi01YjgzNDFiMDkwY2QiLCJpYXQiOjE3NTU1ODM5MzF9.hmuruvzZhr6EhIe6MbzprMcxD6TsoWlqbvQTeSNR3kU`);
        
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