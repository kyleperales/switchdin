import { DeviceControl } from "./types";

export const defaultSolarControls: DeviceControl[] = [
  {
    key: "solar.disconnect",
    name: "Disconnect",
    type: "boolean",
    value: null,
  },
  {
    key: "solar.inverter_output_limit",
    name: "Inverter Output Limit (kW)",
    type: "number",
    value: null,
  },
  {
    key: "solar.export_as_much_as_possible",
    name: "Export as Much as Possible",
    type: "boolean",
    value: null,
  },
];

export const defaultBatteryControls: DeviceControl[] = [
  {
    key: "battery.enable_direct_control_of_battery_power",
    name: "Enable direct control of battery power",
    type: "boolean",
    value: null,
  },
  {
    key: "battery.force_discharge",
    name: "Force export",
    type: "boolean",
    value: null,
  },
  {
    key: "battery.power_set_point",
    name: "Battery Power Set point",
    type: "number",
    value: null,
  },
  {
    key: "battery.minimum_soc_limit",
    name: "Minimum User SoC Limit During Grid Connected Operation",
    type: "number",
    value: null,
  },
];

export const defaultGridControls: DeviceControl[] = [
  {
    key: "grid.feed_in_limit",
    name: "Grid feed in limit",
    type: "number",
    value: null,
  },
  {
    key: "grid.set_point",
    name: "Grid set point",
    type: "number",
    value: null,
  },
  {
    key: "grid.target_power_for_grid_discharge",
    name: "Target power for grid discharge",
    type: "number",
    value: null,
  },
  {
    key: "grid.limit_grid_export_power_percent",
    name: "Limit Grid Export Power (%)",
    type: "number",
    value: null,
  },
];
