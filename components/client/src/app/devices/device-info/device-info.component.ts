import { CommonModule } from '@angular/common'
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatTabsModule } from '@angular/material/tabs'
import { ActivatedRoute, Router } from '@angular/router'
import { BehaviorSubject, catchError, of, Subject, Subscription, switchMap, take, tap } from 'rxjs'
import { Actions, StatusService, StatusState } from '../../core/status'
import { DevicesService, IControl, IDevice, IUpdateControl } from '../devices-service'
import { FormGeneratorComponent, IFormGeneratorOutput } from '../form-generator/form-generator.component'
import { ChartsComponent } from './charts/charts.component'
import { DEVICE_UPDATE_STEPS } from './device-info.model'

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
    ChartsComponent
  ],
  templateUrl: './device-info.component.html',
  styleUrl: './device-info.component.scss'
})
export class DeviceInfoComponent implements OnInit, OnDestroy {

  constructor(
    private devicesService: DevicesService,
    private route: ActivatedRoute,
    private router: Router,
    private statusService: StatusService,
    private snackBar: MatSnackBar
  ) { }

  private deviceSubject = new BehaviorSubject<IDevice | null>(null)
  public device$ = this.deviceSubject.asObservable()
    .pipe(take(2))

  private deviceControlsMap = new Map<string, IControl>()

  get controls() {
    return this.deviceSubject.value?.controls ?? []
  }

  private refreshSubject = new Subject<void>()
  refresh$ = this.refreshSubject.asObservable()

  private deviceId: string
  private subscriptions = new Subscription()
  

  @ViewChild('formGenerator') formGenerator: FormGeneratorComponent

  ngOnInit() {
    this.deviceId = this.route.snapshot.paramMap.get('id') ?? ''

    this.subscriptions.add(
      this.refresh$
        .pipe(
          switchMap(id => 
            this.devicesService.getDeviceById(this.deviceId)
              .pipe(
                catchError(err => {
                  this.snackBar.open('Device not found.', 'Close', {
                    duration: 5000,
                    panelClass: 'error-snackbar'
                  })
                  console.warn('Error getting device by id', err)
                  return of(null)
                })
              )
          ),
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
    
    this.refreshSubject.next()
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe()
    this.deviceSubject.complete()
    this.refreshSubject.complete()
  }

  onFormChanges(changes: IFormGeneratorOutput) {
    this.statusService.setStatus(DEVICE_UPDATE_STEPS)

    if (this.deviceSubject.value) {
      const updateControls = this.mapControlValues(changes)

      this.devicesService.updateDevice(this.deviceSubject.value.id, updateControls)
        .pipe(
          catchError(err => {
            this.statusService.updateStatus(Actions.UpdateDeviceStates, StatusState.Failed)
            this.refreshSubject.next()
            this.formGenerator.resetForm()
            throw Error(err)
          })
        )
        .subscribe(response => {
          this.statusService.updateStatus(Actions.UpdateDeviceStates, StatusState.Success)
          this.refreshSubject.next()
        })
    }
  }

  private mapControlValues(device: IFormGeneratorOutput): IUpdateControl[] {
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
