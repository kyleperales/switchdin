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