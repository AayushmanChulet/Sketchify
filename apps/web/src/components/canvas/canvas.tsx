import { DrawingElement, Game } from "@/lib/game/game";
import { initDraw } from "@/utils";
import { useEffect, useRef, useState } from "react"

export default function Canvas({roomId , socket} : {
    roomId : string, socket: WebSocket
}){
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [game, setGame] = useState<Game>();
    const [selectedTool, setSelectedTool] = useState<DrawingElement>("rect");

    useEffect(() => {
        game?.setDrawingELement(selectedTool);
    }, [selectedTool, game]);

    useEffect(() => {
        if (canvasRef.current) {
            const g = new Game(canvasRef.current, roomId, socket);
            setGame(g);
            return () => {
                g.destroy();
            }
        }
    }, [canvasRef]);

    return <div className="flex">
        <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight} className="overflow-hidden"></canvas>
    </div>
}