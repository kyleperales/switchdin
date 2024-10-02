import { CommonModule } from '@angular/common'
import { Component, OnInit, ViewChild } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { MatTabsModule } from '@angular/material/tabs'
import { ActivatedRoute, Router } from '@angular/router'
import { BehaviorSubject, catchError, filter, of, Subscription, switchMap, tap } from 'rxjs'
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
    MatTabsModule,
    MatIconModule
  ],
  templateUrl: './device-info.component.html',
  styleUrl: './device-info.component.scss'
})
export class DeviceInfoComponent implements OnInit{

  constructor(
    private devicesService: DevicesService,
    private route: ActivatedRoute,
    private router: Router
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
    )
  }

  onFormChanges(changes: IFormGeneratorOutput) {
    if (this.deviceSubject.value) {
      const updateControls = this.mapControlValues(changes)

      this.devicesService.updateDevice(this.deviceSubject.value.id, updateControls)
        .pipe(
          catchError(err => {
            console.error(err)
            this.formGenerator.resetForm()
            return of(null)
          })
        )
        .subscribe(response => {
          console.log(response)
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
