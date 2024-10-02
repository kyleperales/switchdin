import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core'
import { BaseChartDirective } from 'ng2-charts'
import { CHART_OPTIONS, IChartData } from './line-chart.model'

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.scss'
})
export class LineChartComponent implements OnInit, OnChanges {

  constructor() { }

  @Input() label: string | null
  @Input() newData: number | null

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective

  data: IChartData  
  options = CHART_OPTIONS

  ngOnInit() {
    this.data = this.getChartData()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['newData'] && this.data) {
      this.data.labels.push('')
      this.data.datasets[0].data.push(this.newData)
      this.chart?.update()
    }
  }

  private getChartData(): IChartData {
    return {
      labels: [],
      datasets: [
        {
          label: this.label ?? '',
          data: [],
          borderWidth: 1,
        }
      ],
    }
  }
}
