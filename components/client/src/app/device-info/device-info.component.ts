import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatInputModule } from '@angular/material/input'
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { MatTabsModule } from '@angular/material/tabs'
import { ActivatedRoute } from '@angular/router'
import { BehaviorSubject, catchError, of, tap } from 'rxjs'
import { DevicesService, IControl, IDevice, IUpdateControl } from '../devices-service'
import { FormGeneratorComponent, IFormGeneratorOutput } from '../form-generator/form-generator.component'

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

  private deviceSubject = new BehaviorSubject<IDevice | null>({} as IDevice)
  public device$ = this.deviceSubject.asObservable()

  private deviceId: string | null = ''
  private deviceControlsMap = new Map<string, IControl>()


  ngOnInit() {
    this.deviceId = this.route.snapshot.paramMap.get('id')

    if (this.deviceId) {
      this.devicesService.getDeviceById(this.deviceId)
        .pipe(
          catchError(err => {
            console.error(err)
            return of(null)
          }),
          tap(device => {            
            this.deviceControlsMap = (device?.controls ?? [])
              .reduce((acc, control) => {
                acc.set(control.key, control)
                return acc
              }, new Map())
          })
        )
        .subscribe(device => {
          console.log(device)
          this.deviceSubject.next(device)
        })
    }
  }

  onFormChanges(changes: IFormGeneratorOutput) {
    if (this.deviceSubject.value) {
      const updateControls = this.mapControlValues(changes)

      this.devicesService.updateDevice(this.deviceSubject.value.id, updateControls)
        .subscribe(response => {
          console.log(response)
        })
    }
  }

  mapControlValues(device: IFormGeneratorOutput): IUpdateControl[] {
    return Object.keys(device).map(key => ({
      key: key,
      value: this.deviceControlsMap.get(key)?.type === 'boolean'
        ? device[key]
        : device[key] ?? this.deviceControlsMap.get(key)?.value ?? 0
    }))
  }
}
