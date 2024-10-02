export interface IControl {
  key: string
  name: string
  type: 'boolean' | 'number'
  value: boolean | number | null
}

export interface IMetric {
  key: string
  name: string
  unit: string
}

export interface IDevice {
  id: string
  name: string
  controls: IControl[]
  metrics: IMetric[]
}

export interface IUpdateControl {
  key: string
  value: boolean | number | null
}

export interface IUpdateResponse {
  message: string
}