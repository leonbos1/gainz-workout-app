import { Database } from "@/database/database";
import { Exercise } from "./Exercise";
import { GraphDuration } from "./GraphDuration";
import { GraphType } from "./GraphType";
import { round } from 'lodash';

export class ChartDataset {
  data: number[];
  labels: string[];
  label: string;
  strokeWidth!: number;

  constructor(
    data: number[],
    labels: string[],
    label: string
  ) {
    this.data = data;
    this.labels = labels;
    this.label = label;
  }

  static async create(exercise: Exercise, graphDuration: GraphDuration, graphType: GraphType): Promise<ChartDataset> {
    var data = new ChartDataset([], [], "");

    if (graphType.id == 1) {
      data = await this.getEstimated1RM(exercise.id, Math.round(graphDuration.value / 7));
    }

    if (graphType.id == 2) {
      data = await this.getVolume(exercise.id, Math.round(graphDuration.value / 7));
    }

    return data;
  }


  static async getEmptyDataset(exerciseId: number): Promise<ChartDataset> {
    var exercise = await Exercise.findById(exerciseId);

    return new ChartDataset([], [], exercise.name);
  }

  static async getEstimated1RM(exerciseId: number, weeks: number): Promise<ChartDataset> {
    const db = await Database.getDbConnection();

    try {
      weeks = round(weeks);

      const rows = await db.getAllAsync(`
      SELECT strftime('%Y-%m-%d', w.endtime, 'weekday 0', '-6 days') as monday, 
             MAX(es.weight * (1 + (es.amount * 0.0333))) as estimated1RM
      FROM exerciseset es
      JOIN batch b ON es.batchid = b.id
      JOIN workout w ON b.workoutid = w.id
      WHERE es.exerciseid = ?
      GROUP BY monday
      ORDER BY monday DESC
      LIMIT ?
    `, [exerciseId, weeks]) as { monday: string, estimated1RM: number }[];

      // Reverse rows for chronological order.
      rows.reverse();

      const data: number[] = [];
      const labels: string[] = [];
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

      rows.forEach((row, index) => {
        data[index] = row.estimated1RM;
        const date = new Date(row.monday);
        const year = date.getFullYear();
        const monthLabel = monthNames[date.getMonth()];
        // If it's January, append the year; otherwise, show just the month.
        const label = (date.getMonth() === 0) ? `${monthLabel} ${year}` : monthLabel;
        labels[index] = label;
      });

      const totalLabelsToShow = 8;
      const interval = Math.ceil(labels.length / totalLabelsToShow);
      for (let i = 0; i < labels.length; i++) {
        if (i % interval !== 0) {
          labels[i] = '';
        }
      }

      const exercise = await db.getFirstAsync('SELECT name FROM exercise WHERE id = ?', [exerciseId]) as { name: string };

      return new ChartDataset(data, labels, exercise.name);
    }
    catch (error) {
      console.log(error);
      return this.getEmptyDataset(exerciseId);
    }
  }

  static async getVolume(exerciseId: number, weeks: number): Promise<ChartDataset> {
    try {
      const db = await Database.getDbConnection();

      weeks = Math.round(weeks);

      // Generate the date range for the last `weeks` weeks.
      const endDate = new Date(); // current date
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - weeks * 7);

      const dateRange: { monday: string; volume: number }[] = [];
      let currentMonday = new Date(startDate);
      // Adjust to Monday (assuming Monday is the first day of the week)
      currentMonday.setDate(currentMonday.getDate() - currentMonday.getDay() + 1);

      while (currentMonday <= endDate) {
        dateRange.push({ monday: currentMonday.toISOString().split('T')[0], volume: 0 });
        currentMonday.setDate(currentMonday.getDate() + 7); // next Monday
      }

      // Query the database for volume data.
      const rows = await db.getAllAsync(
        `
      SELECT strftime('%Y-%m-%d', w.endtime, 'weekday 0', '-6 days') as monday, 
             SUM(es.amount * es.weight) as volume
      FROM exerciseset es
      JOIN batch b ON es.batchid = b.id
      JOIN workout w ON b.workoutid = w.id
      WHERE es.exerciseid = ?
      GROUP BY monday
      ORDER BY monday ASC
      `,
        [exerciseId]
      ) as { monday: string; volume: number }[];

      const data: number[] = [];
      const labels: string[] = [];
      let cumulativeVolume = 0;
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

      dateRange.forEach((week) => {
        const match = rows.find((row) => row.monday === week.monday);
        const weeklyVolume = match ? match.volume : 0;
        cumulativeVolume += weeklyVolume;
        data.push(cumulativeVolume);

        const date = new Date(week.monday);
        const year = date.getFullYear();
        const monthLabel = monthNames[date.getMonth()];
        // Always include the year if it's January.
        const label = (date.getMonth() === 0) ? `${monthLabel} ${year}` : monthLabel;
        labels.push(label);
      });

      // (Optional) Show only a subset of labels, for example every nh label.
      const totalLabelsToShow = 8;
      const interval = Math.ceil(labels.length / totalLabelsToShow);
      for (let i = 0; i < labels.length; i++) {
        if (i % interval !== 0) {
          labels[i] = '';
        }
      }

      const exercise = await db.getFirstAsync('SELECT name FROM exercise WHERE id = ?', [exerciseId]) as { name: string };

      return new ChartDataset(data, labels, exercise.name);
    }

    catch (error) {
      console.log(error);
      return await this.getEmptyDataset(exerciseId);
    }
  }
}

