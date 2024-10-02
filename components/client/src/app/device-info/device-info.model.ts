import { Actions, IStatus, StatusState } from '../core/status'

export const DEVICE_UPDATE_STEPS: IStatus[] = [
    { id: Actions.UpdateDeviceStates, name: 'Updating device', state: StatusState.Pending },
    { id: Actions.RefreshDeviceProperties, name: 'Refreshing device properties', state: StatusState.Pending },
  ]