export enum StatusState {
  Pending = 0,
  Success,
  Failed
}

export enum Actions {
  UpdateDeviceStates = 'updateDeviceStates',
  RefreshDeviceProperties = 'refreshDeviceProperties'
}

export interface IStatus {
  id: Actions
  description: string
  state: StatusState
}