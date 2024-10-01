export type DeviceControl = {
  key: string;
  name: string;
} & (
  | {
      type: "boolean";
      value: boolean | null;
    }
  | {
      type: "number";
      value: number | null;
    }
);

export interface DeviceMetric {
  key: string;
  name: string;
  unit: string;
}

export interface DeviceMetricReading {
  metric: string;
  value: number | boolean | null;
}

export interface Device {
  id: string;
  name: string;
  controls: DeviceControl[];
  metrics: DeviceMetric[];
}
