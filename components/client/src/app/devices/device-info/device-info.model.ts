import { Actions, IStatus, StatusState } from '../../core/status'

export const DEVICE_UPDATE_STEPS: IStatus[] = [
    { id: Actions.UpdateDeviceStates, description: 'status.updating-device', state: StatusState.Pending },
    { id: Actions.RefreshDeviceProperties, description: 'status.refreshing-device', state: StatusState.Pending },
  ]