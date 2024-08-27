export class ChartDataset {
  data: number[];
  labels: string[];
  strokeWidth?: number;
  label: string;

  constructor(
    data: number[],
    labels: string[],
    strokeWidth: number = 2,
    label: string
  ) {
    this.data = data;
    this.labels = labels;
    this.strokeWidth = strokeWidth;
    this.label = label;
  }
}
