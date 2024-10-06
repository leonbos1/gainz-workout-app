export class ChartDataset {
  data: number[];
  labels: string[];
  label: string;

  constructor(
    data: number[],
    labels: string[],
    label: string
  ) {
    this.data = data;
    this.labels = labels;
    this.label = label;
  }
}