import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { env } from '../../../environment'
import { IDevice, IUpdateControl, IUpdateResponse } from './device.model'

const DEVICES_ROUTE = '/api/v1/devices/'

@Injectable({ providedIn: 'root' })
export class DevicesService {    
  constructor(
    private http: HttpClient
  ) { }

  getDevices(): Observable<IDevice[]> {
    return this.http.get<IDevice[]>(`${env.baseUrl}${DEVICES_ROUTE}`)
  }

  getDeviceById(id: string): Observable<IDevice> {
    return this.http.get<IDevice>(`${env.baseUrl}${DEVICES_ROUTE}${id}`)
  }

  updateDevice(id: string, controls: IUpdateControl[]): Observable<IUpdateResponse> {
    return this.http.post<IUpdateResponse>(`${env.baseUrl}${DEVICES_ROUTE}${id}`, { controls })
  }
}