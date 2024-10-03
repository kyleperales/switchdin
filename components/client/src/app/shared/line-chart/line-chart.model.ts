export interface IChartData {
    labels: string[]
    datasets: {
      label: string
      data: (number| null)[]
      borderWidth: number
    }[]
  }

export const CHART_OPTIONS = {
  aspectRatio:5.2,
  scales: {
    y: {
      beginAtZero: true,
    },
  },
}

export const MAX_DATA_POINTS = 40