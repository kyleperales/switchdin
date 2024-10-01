import { DeviceMetric } from "./types";

export const solarMetrics: DeviceMetric[] = [
  {
    key: "solar_generation",
    name: "Solar Generation",
    unit: "kW",
  },
  {
    key: "solar_generation_total",
    name: "Solar Generation Total",
    unit: "kWh",
  },
  {
    key: "solar_consumption",
    name: "Solar Consumption",
    unit: "kW",
  },
  {
    key: "solar_inverter_efficiency",
    name: "Solar Inverter Efficiency",
    unit: "%",
  },
];

export const batteryMetrics: DeviceMetric[] = [
  {
    key: "battery_charge",
    name: "Battery Charge",
    unit: "kW",
  },
  {
    key: "battery_discharge",
    name: "Battery Discharge",
    unit: "kW",
  },
  {
    key: "battery_soc",
    name: "Battery SoC",
    unit: "%",
  },
  {
    key: "battery_storage",
    name: "Battery Storage",
    unit: "kWh",
  },
];

export const gridMetrics: DeviceMetric[] = [
  {
    key: "grid_import",
    name: "Grid Import",
    unit: "kW",
  },
  {
    key: "grid_export",
    name: "Grid Export",
    unit: "kW",
  },
  {
    key: "grid_import_total",
    name: "Grid Import Total",
    unit: "kWh",
  },
  {
    key: "grid_export_total",
    name: "Grid Export Total",
    unit: "kWh",
  },
];
