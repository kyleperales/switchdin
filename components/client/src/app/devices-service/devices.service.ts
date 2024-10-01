import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Device } from './device.model';

@Injectable({ providedIn: 'root' })
export class DevicesService {
    
    constructor(
        private http: HttpClient
    ) {}

    private readonly baseUrl = 'http://localhost:3000';

    getDevices(): Observable<any[]> {
        return this.http.get<Device[]>(`${this.baseUrl}/api/v1/devices/`);
    }
    
    // addDevice(device: any): void {
    //     this.devices.push(device);
    // }

    // removeDevice(deviceId: string): void {
    //     this.devices = this.devices.filter(device => device.id !== deviceId);
    // }

    // updateDevice(deviceId: string, updatedDevice: any): void {
    //     const index = this.devices.findIndex(device => device.id === deviceId);
    //     if (index !== -1) {
    //         this.devices[index] = updatedDevice;
    //     }
    // }
}