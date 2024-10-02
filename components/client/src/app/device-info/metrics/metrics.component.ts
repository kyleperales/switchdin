import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core'
import { MetricsService } from './metrics.service'

@Component({
  selector: 'app-metrics',
  standalone: true,
  imports: [],
  templateUrl: './metrics.component.html',
  styleUrl: './metrics.component.scss'
})
export class MetricsComponent implements OnInit, OnChanges, OnDestroy {
  @Input() deviceId: string

  constructor(
    private metricsService: MetricsService
  ) { }

  ngOnInit() {
    this.metricsService.webSocket$
      .subscribe((data) => {
        console.log(data)
      })
  }

  ngOnChanges() {
    this.metricsService.subscribe(this.deviceId)
  }

  ngOnDestroy(): void {
    this.metricsService.unsubscribe(this.deviceId)
  }
}
