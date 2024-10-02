import { CommonModule } from '@angular/common'
import { AfterViewInit, Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core'
import { filter, skip } from 'rxjs'
import { LineChartComponent } from '../../core/line-chart/line-chart.component'
import { IDevice } from '../../devices-service'
import { ChartsService, IWebSocketData } from './charts.service'

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [CommonModule, LineChartComponent],
  templateUrl: './charts.component.html',
  styleUrl: './charts.component.scss'
})
export class ChartsComponent implements OnChanges, OnDestroy, AfterViewInit, OnChanges {
  @Input() device: IDevice

  get metrics() {
    return this.device.metrics
  }
  get controls() {
    return this.device.controls.filter(c => c.type !== 'boolean')
  }

  metricsDataMap: Map<string, number | null>
  metricsUnitMap: Map<string, string>

  controlsDataMap: Map<string, number | null>

  constructor(
    private metricsService: ChartsService
  ) { }

  ngAfterViewInit(): void {
    this.metricsService.webSocket$
      .pipe(
        skip(1),
        filter(data => (data as { type: string })?.type !== 'control-acknowledgement'),
      )
      .subscribe(data => {
        this.mapData(data as IWebSocketData)
      })
  }

  private mapData(data: IWebSocketData)  {
    this.metricsDataMap.forEach((value, key) => {
      const metric = data.measurements.find(measurement => measurement.metric === key)
      this.metricsDataMap.set(key, metric?.value ?? 0)
    })

    this.controlsDataMap.forEach((value, key) => {
      const control = data.measurements.find(measurement => measurement.metric === key)
      this.controlsDataMap.set(key, control?.value ?? 0)
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['device'] && this.device) {
      this.metricsService.subscribe(this.device.id)
      this.setupMaps()
    }
  }

  private setupMaps() {      
    this.metricsDataMap = this.metrics.reduce((acc, metric) => {
      acc.set(metric.key, null)
      return acc
    }, new Map<string, number | null>())

    this.metricsUnitMap = this.metrics.reduce((acc, metric) => {
      acc.set(metric.key, metric.unit)
      return acc
    }, new Map<string, string>())

    this.controlsDataMap = this.controls.reduce((acc, control) => {
      acc.set(control.key, null)
      return acc
    }, new Map<string, number | null>())
  }

  ngOnDestroy(): void {
    this.metricsService.unsubscribe(this.device.id)
  }
}
