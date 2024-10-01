import * as uuid from "uuid";
import { DeviceControl, Device, DeviceMetric } from "./types";

const DEVICE_NAMESPACE_UUID = "f7b1b3b0-6b7b-11eb-9439-0242ac130002";

export function generateDevice(
  name: string,
  controls: DeviceControl[],
  metrics: DeviceMetric[],
): Device {
  return {
    id: uuid.v5(name, DEVICE_NAMESPACE_UUID),
    name,
    controls,
    metrics,
  };
}
