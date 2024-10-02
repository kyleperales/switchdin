import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { catchError } from 'rxjs'
import { IDevice, DevicesService } from '../devices-service'

@Component({
  selector: 'app-device-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './device-list.component.html',
  styleUrl: './device-list.component.scss'
})
export class DeviceListComponent implements OnInit{
  
  constructor(
    private devicesService: DevicesService,
    private router: Router
  ) { }

  devices: IDevice[] = []

  ngOnInit() {
    this.devicesService.getDevices()
      .pipe(
        catchError(err => {
          throw Error(err)
        })
      )
      .subscribe(devices => {
        this.devices = devices
      })
  }

  onDeviceClick(id: string) {
    this.router.navigate(['device-info', id])
  }
}
