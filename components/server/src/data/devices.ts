import { applyRandomVarianceWithJump } from "@/utils";
import { clamp } from "ramda";

import { DeviceControl, Device, DeviceMetricReading } from "./devices/types";
import {
  defaultSolarControls,
  defaultBatteryControls,
  defaultGridControls,
} from "./devices/controls";
import { generateDevice } from "./devices/util";
import { batteryMetrics, gridMetrics, solarMetrics } from "./devices/metrics";

let devices = [
  generateDevice("Solar", defaultSolarControls, solarMetrics),
  generateDevice("Battery", defaultBatteryControls, batteryMetrics),
  generateDevice("Grid", defaultGridControls, gridMetrics),
];

let measurements = new Map<Device, Map<string, number | boolean | null>>();

export function generateMeasurements(device: Device): DeviceMetricReading[] {
  if (!measurements.has(device)) {
    measurements.set(device, new Map());
  }

  const deviceMeasurements = measurements.get(device)!;
  const { metrics, controls } = device;

  for (const metric of metrics) {
    if (!deviceMeasurements.has(metric.key)) {
      deviceMeasurements.set(metric.key, Math.random() * 100);
    } else {
      const lastMeasurement = deviceMeasurements.get(metric.key) as number;

      const variance = Math.random() * 0.5;
      const newMeasurement = clamp(
        0,
        100,
        applyRandomVarianceWithJump({
          baseValue: lastMeasurement,
          variance,
          jumpFactor: 5.0,
        }),
      );

      deviceMeasurements.set(metric.key, newMeasurement);
    }
  }

  for (const control of controls) {
    deviceMeasurements.set(control.key, control.value);
  }

  return Array.from(deviceMeasurements.entries()).map<DeviceMetricReading>(
    ([key, value]) => ({
      metric: key,
      value,
    }),
  );
}

export { Device, DeviceControl };

export default devices;
