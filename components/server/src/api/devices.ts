import { RequestHandler } from "express";
import devices, { Device, DeviceControl } from "@/data/devices";
import * as yup from "yup";
import { ExpressYupMiddlewareInterface } from "express-yup-middleware";
import { equals, findIndex, pluck } from "ramda";
import { produce } from "immer";
import { deviceSubscriptions, wss } from "@/websocket-server";

export const getDevices: RequestHandler = (req, res) => {
  res.status(200).json(devices);
};

export interface ErrorResponse {
  message: string;
}

export interface DeviceParams {
  deviceId: string;
}

export const getDevice: RequestHandler<DeviceParams, Device | ErrorResponse> = (
  req,
  res,
) => {
  const device = devices.find((device) => device.id === req.params.deviceId);

  if (!device) {
    res.status(404).json({ message: "Device not found" });
    return;
  }

  res.status(200).json(device);
};

export const updateDeviceSchema: ExpressYupMiddlewareInterface = {
  schema: {
    params: {
      yupSchema: yup.object({
        deviceId: yup.string().required(),
      }),
    },
    body: {
      yupSchema: yup.object({
        controls: yup
          .array()
          .of(
            yup.object({
              key: yup.string().required(),
              value: yup.string().required(),
            }),
          )
          .required(),
      }),
    },
  },
};

export const updateDevice: RequestHandler<
  DeviceParams,
  Device | ErrorResponse,
  Pick<Device, "controls">
> = (req, res) => {
  let device =
    devices[findIndex(equals(req.params.deviceId), pluck("id", devices))];

  if (!device) {
    res.status(404).json({ message: "Device not found" });
    return;
  }

  let controls = device.controls;

  for (const control of req.body.controls) {
    const controlIndex = findIndex(equals(control.key), pluck("key", controls));

    if (controlIndex == null || controlIndex < 0) {
      res.status(400).json({ message: `Invalid control key: ${control.key}` });
      return;
    } else {
      controls[controlIndex] = produce(controls[controlIndex], (draft) => {
        const newValue = String(control.value);

        switch (draft.type) {
          case "boolean":
            draft.value = newValue === "true";
            break;
          case "number":
            draft.value = parseFloat(newValue);
            break;
        }
      });

      // send control acknowledgement via websocket
      Array.from(deviceSubscriptions.keys()).forEach((ws) => {
        const devices = deviceSubscriptions.get(ws) ?? [];

        if (devices.includes(device)) {
          // fail to send ack 20% of the time
          if (Math.random() > 0.2) {
            ws.send(
              JSON.stringify({
                type: "control-acknowledgement",
                deviceId: device.id,
                control: controls[controlIndex].key,
              }),
            );
          }
        }
      });
    }
  }

  device.controls = controls;

  res.status(204).end();
};
