import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatInputModule } from '@angular/material/input'
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { MatTabsModule } from '@angular/material/tabs'
import { ActivatedRoute } from '@angular/router'
import { BehaviorSubject, catchError, of } from 'rxjs'
import { Device, DevicesService } from '../devices-service'
import { FormGeneratorComponent } from '../form-generator/form-generator.component'

@Component({
  selector: 'app-device-info',
  standalone: true,
  imports: [
    CommonModule,
    MatSlideToggleModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormGeneratorComponent,
    MatTabsModule
  ],
  templateUrl: './device-info.component.html',
  styleUrl: './device-info.component.scss'
})
export class DeviceInfoComponent implements OnInit{

  constructor(
    private devicesService: DevicesService,
    private route: ActivatedRoute,
  ) { }

  private deviceSubject = new BehaviorSubject<Device | null>({} as Device)
  public device$ = this.deviceSubject.asObservable()

  ngOnInit() {
    const deviceId = this.route.snapshot.paramMap.get('id')
    if (deviceId) {
      this.devicesService.getDeviceById(deviceId)
        .pipe(
          catchError(err => {
            console.error(err)
            return of(null)
          })
        )
        .subscribe(device => {
          console.log(device)
          this.deviceSubject.next(device)
        })
    }
  }
}
