import { CommonModule } from '@angular/common'
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { MatTabsModule } from '@angular/material/tabs'
import { ActivatedRoute, Router } from '@angular/router'
import { BehaviorSubject, catchError, filter, Subscription, switchMap, tap } from 'rxjs'
import { Actions, StatusService, StatusState } from '../core/status'
import { DevicesService, IControl, IDevice, IUpdateControl } from '../devices-service'
import { FormGeneratorComponent, IFormGeneratorOutput } from '../form-generator/form-generator.component'
import { DEVICE_UPDATE_STEPS } from './device-info.model'
import { MetricsComponent } from './metrics/metrics.component'

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
    MatTabsModule,
    MatIconModule,
    MetricsComponent
  ],
  templateUrl: './device-info.component.html',
  styleUrl: './device-info.component.scss'
})
export class DeviceInfoComponent implements OnInit, OnDestroy {

  constructor(
    private devicesService: DevicesService,
    private route: ActivatedRoute,
    private router: Router,
    private statusService: StatusService
  ) { }

  private deviceSubject = new BehaviorSubject<IDevice | null>({} as IDevice)
  public device$ = this.deviceSubject.asObservable()

  private deviceControlsMap = new Map<string, IControl>()
  private deviceIdSubject = new BehaviorSubject<string | null>(null)
  public deviceId$ = this.deviceIdSubject.asObservable()

  private subscriptions = new Subscription()

  @ViewChild('formGenerator') formGenerator: FormGeneratorComponent

  ngOnInit() {
    const deviceId = this.route.snapshot.paramMap.get('id')
    this.deviceIdSubject.next(deviceId)

    this.subscriptions.add(
      this.deviceId$
        .pipe(
          filter(id => !!id),
          switchMap(id => this.devicesService.getDeviceById(id as string)),
          catchError(err => {
            this.statusService.updateStatus(Actions.RefreshDeviceProperties, StatusState.Failed)
            this.onHomeClick()
            throw Error(err)
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
          this.statusService.updateStatus(Actions.RefreshDeviceProperties, StatusState.Success)
          this.deviceSubject.next(device)
        })
    )
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe()
  }

  onFormChanges(changes: IFormGeneratorOutput) {
    this.statusService.setStatus(DEVICE_UPDATE_STEPS)

    if (this.deviceSubject.value) {
      const updateControls = this.mapControlValues(changes)

      this.devicesService.updateDevice(this.deviceSubject.value.id, updateControls)
        .pipe(
          catchError(err => {
            this.statusService.updateStatus(Actions.UpdateDeviceStates, StatusState.Failed)
            this.deviceIdSubject.next(this.deviceIdSubject.value)
            this.formGenerator.resetForm()
            throw Error(err)
          })
        )
        .subscribe(response => {
          this.statusService.updateStatus(Actions.UpdateDeviceStates, StatusState.Success)
          this.deviceIdSubject.next(this.deviceIdSubject.value)
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

  onHomeClick() {
    this.router.navigate(['devices'])
  }
}
