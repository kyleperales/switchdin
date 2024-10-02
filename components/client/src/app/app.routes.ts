import { Routes } from '@angular/router'
import { DeviceInfoComponent } from './devices/device-info/device-info.component'
import { DeviceListComponent } from './devices/device-list/device-list.component'

export const routes: Routes = [
  { path: 'devices', component: DeviceListComponent },
  { path: 'device-info/:id', component: DeviceInfoComponent },
  { path: '**', redirectTo: 'devices' }
]
