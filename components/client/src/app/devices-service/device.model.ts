export interface Control {
  key: string;
  name: string;
  type: boolean | number;
  value: boolean | number | null;
}

export interface Metric {
  key: string;
  name: string;
  unit: string;
}

export interface Device {
  id: string;
  name: string;
  controls: Control[];
  metrics: Metric[];
}
