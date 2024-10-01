import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs';
import { Device, DevicesService } from '../devices-service';

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

  devices: Device[] = []

  ngOnInit() {
    this.devicesService.getDevices()
      .pipe(
        catchError(err => {
          console.error(err);
          return [];
        })
      )
      .subscribe(devices => {
        this.devices = devices;
        console.log(devices);
      });
  }

  onDeviceClick(id: string) {
    this.router.navigate(['device-info', id]);
  }
}
