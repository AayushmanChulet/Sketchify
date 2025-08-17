import { WebSocket, WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend/config";
import { client } from "@repo/database/client";

interface User {
  ws: WebSocket;
  rooms: string[];
  userId: string;
}

const wss = new WebSocketServer({
  port: 8080,
});

const validUser = (token: string): string | null => {
  try {
    const decode = jwt.verify(token, JWT_SECRET);

    if (typeof decode == "string") {
      return null;
    }

    if (!decode || !decode.data) {
      return null;
    }

    return decode.data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const users: User[] = [];

wss.on("error", console.error);

wss.on("connection", (ws: WebSocket, request) => {
  const url = request.url;

  if (!url) return;

  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("Authorization") || "";

  const user = validUser(token);

  if (user == null) {
    ws.close();
    return;
  }

  users.push({
    userId: user,
    rooms: [],
    ws,
  });

  ws.on("message", async (event) => {
    let parsedData;
    if (typeof event != "string") {
      parsedData = JSON.parse(event.toString());
    } else {
      parsedData = JSON.parse(event);
    }

    if (parsedData.type == "join_room") {
      const user = users.find((el) => el.ws === ws);
      user?.rooms.push(parsedData.roomId);
    }

    if (parsedData.type == "leave_room") {
      const user = users.find((el) => el.ws === ws);
      if (!user) {
        return;
      }
      user.rooms = user?.rooms.filter((el) => el !== parsedData.roomId);
    }
    if (parsedData.type == "chat") {
      const roomId = parsedData.roomId;
      const message = parsedData.message;

      await client.chat.create({
        data: {
          message,
          userId: user,
          roomId,
        },
      });

      users.forEach((u) => {
      if (u.rooms.includes(roomId)) {
        u.ws.send(
          JSON.stringify({
            message,
            type: "chat",
            roomId,
          })
        );
      }
    });
    }
  });
});
