import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Router } from '@angular/router'
import { catchError, retry } from 'rxjs'
import { DevicesService } from '../devices-service'

@Component({
  selector: 'app-device-list',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './device-list.component.html',
  styleUrl: './device-list.component.scss'
})
export class DeviceListComponent implements OnInit{
  
  constructor(
    private devicesService: DevicesService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  devices: any = []
  isLoading = false
  hasError: any

  ngOnInit() {
    this.isLoading = true
    this.devicesService.getDevices()
      .pipe(
        retry({
          count: 3,
          delay: 1000
        }),
        catchError(err => {
          this.snackBar.open('Something went wrong.', 'Close', {
            duration: 5000,
            panelClass: 'error-snackbar'
          })

          this.isLoading = false
          this.hasError = true
          throw Error(err)
        })
      )
      .subscribe(devices => {
        this.isLoading = false
        this.devices = devices
      })
  }

  onDeviceClick(id: string) {
    this.router.navigate(['device-info', id])
  }
}
