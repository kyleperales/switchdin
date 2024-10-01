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

    getDevices(): Observable<Device[]> {
        return this.http.get<Device[]>(`${this.baseUrl}/api/v1/devices/`);
    }

    getDeviceById(id: string): Observable<Device> {
        return this.http.get<Device>(`${this.baseUrl}/api/v1/devices/${id}`);
    }
}