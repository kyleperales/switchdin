import ws, { RawData } from "ws";
import devices, { Device, generateMeasurements } from "@/data/devices";

export const deviceSubscriptions = new Map<ws, Device[]>();

const WS_PORT = parseInt(process.env.WS_PORT || String(3001));

const wss = new ws.WebSocketServer({
  port: WS_PORT,
});

function handleSubscribe(client: ws, deviceId: string) {
  const device = devices.find((device) => device.id === deviceId);

  if (!device) {
    client.send(
      JSON.stringify({
        message: "Device not found",
      }),
    );
    return;
  }

  const subscriptions = deviceSubscriptions.get(client) ?? [];

  deviceSubscriptions.set(client, [...subscriptions, device]);
}

function handleUnsubscribe(client: ws, deviceId: string) {
  const subscriptions = deviceSubscriptions.get(client) ?? [];

  deviceSubscriptions.set(
    client,
    subscriptions.filter((device) => device.id !== deviceId),
  );
}

function handleMessage(client: ws, data: RawData) {
  const stringBuffer = (data as Buffer).toString("utf8");

  try {
    const message = JSON.parse(stringBuffer);

    switch (message.type) {
      case "subscribe":
        handleSubscribe(client, message.deviceId);
        break;
      case "unsubscribe":
        handleUnsubscribe(client, message.deviceId);
        break;
    }
  } catch (e) {
    console.error("Could not parse message: ", stringBuffer, e);
  }
}

wss.on("connection", function connection(ws) {
  ws.on("error", console.error);

  ws.on("message", (data) => handleMessage(ws, data));

  ws.send(
    JSON.stringify({
      message: "Welcome",
    }),
  );

  const interval = setInterval(() => {
    const devices = deviceSubscriptions.get(ws) ?? [];

    devices.forEach((device) => {
      ws.send(
        JSON.stringify({
          deviceId: device.id,
          measurements: generateMeasurements(device),
        }),
      );
    });
  }, 1000);

  ws.on("close", () => {
    deviceSubscriptions.delete(ws);
    clearInterval(interval);
  });
});

export { wss };
