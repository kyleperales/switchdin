import express, { RequestHandler } from "express";
import dotenv from "dotenv";

import * as devices from "@/api/devices";
import { expressYupMiddleware } from "express-yup-middleware";
import { wss } from "./websocket-server";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const HTTP_PORT = parseInt(process.env.HTTP_PORT || String(3000));
const WS_PORT = parseInt(process.env.WS_PORT || String(3001));

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello World" });
});

app.get("/api/v1/devices/", devices.getDevices);
app.get("/api/v1/devices/:deviceId", devices.getDevice);
app.post(
  "/api/v1/devices/:deviceId",
  expressYupMiddleware({ schemaValidator: devices.updateDeviceSchema }),
  devices.updateDevice as unknown as RequestHandler,
);

app.listen(HTTP_PORT, () => {
  console.log("HTTP server:", `http://localhost:${HTTP_PORT}`);
});

wss.on("listening", () => {
  function getWebserverAddress(): string {
    let address = wss.address();
    if (typeof address === "object") {
      return `ws://localhost:${address.port}`;
    }

    return address;
  }

  console.log("WebSocket server:", getWebserverAddress());
});
