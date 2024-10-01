import { Routes } from '@angular/router'
import { DeviceInfoComponent } from './device-info/device-info.component'
import { DeviceListComponent } from './device-list/device-list.component'

export const routes: Routes = [
  { path: 'devices', component: DeviceListComponent },
  { path: 'device-info/:id', component: DeviceInfoComponent },
  { path: '**', redirectTo: 'devices' }
]
