import { DrawingElement, Game } from "@/lib/game/game";
import { initDraw } from "@/utils";
import { useEffect, useRef, useState } from "react";
import IconButton from "../../ui/IconButton";
import { Circle, Minus, MoveRight, RectangleHorizontalIcon } from "lucide-react";

export default function Canvas({
  roomId,
  socket,
}: {
  roomId: string;
  socket: WebSocket;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [game, setGame] = useState<Game>();
  const [selectedTool, setSelectedTool] = useState<DrawingElement>("circle");

  useEffect(() => {
    game?.setDrawingELement(selectedTool);
  }, [selectedTool, game]);

  useEffect(() => {
    if (canvasRef.current) {
      const g = new Game(canvasRef.current, roomId, socket, localStorage.getItem("authorization") || "");
      setGame(g);
      return () => {
        g.destroy();
      };
    }
  }, [canvasRef]);

  return (
    <div className="h-dvh w-dvw overflow-hidden">
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        className="z-10"
      />
      <div>
        <div
          className="fixed bottom-5 left-1/2 -translate-x-1/2  "
        >
          <div className="flex  border rounded z-50">
            <IconButton
              onClick={() => {
                setSelectedTool("line");
              }}
              isActivated={selectedTool === "line"}
              icon={<Minus />}
            />

            <IconButton
              onClick={() => {
                setSelectedTool("rect");
              }}
              isActivated={selectedTool === "rect"}
              icon={<RectangleHorizontalIcon />}
            />

            <IconButton
              onClick={() => {
                setSelectedTool("circle");
              }}
              isActivated={selectedTool === "circle"}
              icon={<Circle />}
            />

            <IconButton
              onClick={() => {
                setSelectedTool("arrow");
              }}
              isActivated={selectedTool === "arrow"}
              icon={<MoveRight />}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
