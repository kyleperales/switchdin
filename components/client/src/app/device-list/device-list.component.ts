import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
    private devicesService: DevicesService
  ) { }

  devices: Device[] = []

  ngOnInit() {
    this.devicesService.getDevices().subscribe(devices => {
      this.devices = devices;
      console.log(devices);
    });
  }

}
