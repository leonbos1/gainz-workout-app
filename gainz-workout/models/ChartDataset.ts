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

      const rows = await db.getAllAsync(
        `
        SELECT strftime('%Y-%m-%d', w.endtime, 'weekday 0', '-6 days') as monday, 
               MAX(es.weight * (1 + (es.amount * 0.0333))) as estimated1RM
        FROM exerciseset es
        JOIN batch b ON es.batchid = b.id
        JOIN workout w ON b.workoutid = w.id
        WHERE es.exerciseid = ?
        GROUP BY monday
        ORDER BY monday DESC
        LIMIT ?
        `,
        [exerciseId, weeks]
      ) as { monday: string, estimated1RM: number }[];

      // Reverse rows for chronological order.
      rows.reverse();

      const data: number[] = [];
      const labels: string[] = [];

      if (rows.length > 0) {
        // Determine the timespan of the data.
        const firstDate = new Date(rows[0].monday);
        const lastDate = new Date(rows[rows.length - 1].monday);
        const oneYearInMs = 365 * 24 * 60 * 60 * 1000;
        // If the span is greater than one year, use year labels; otherwise, use month labels.
        const labelFormat = (lastDate.getTime() - firstDate.getTime() > oneYearInMs) ? 'year' : 'month';

        rows.forEach((row, index) => {
          data.push(row.estimated1RM);
          const currentDate = new Date(row.monday);

          if (labelFormat === 'year') {
            // For a multi-year span, only show the year when it changes.
            if (index === 0 || currentDate.getFullYear() !== new Date(rows[index - 1].monday).getFullYear()) {
              labels.push(currentDate.getFullYear().toString());
            } else {
              labels.push('');
            }
          } else {
            // For a one-year span, display the abbreviated month when it changes.
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            if (index === 0 || currentDate.getMonth() !== new Date(rows[index - 1].monday).getMonth()) {
              labels.push(monthNames[currentDate.getMonth()]);
            } else {
              labels.push('');
            }
          }
        });
      } else {
        // In case there are no rows, add a couple of dummy points to avoid errors in the chart.
        data.push(0, 0);
        labels.push('', '');
      }

      const exercise = await db.getFirstAsync(
        'SELECT name FROM exercise WHERE id = ?',
        [exerciseId]
      ) as { name: string };

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
      const endDate = new Date();
  
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
  
      // Determine the start date for our date range.
      // If we have data, use the earliest monday from the results.
      // Otherwise, fall back to (endDate - weeks*7).
      let startDateForRange: Date;
      if (rows.length > 0) {
        startDateForRange = new Date(rows[0].monday);
      } else {
        startDateForRange = new Date();
        startDateForRange.setDate(endDate.getDate() - weeks * 7);
      }
  
      // Generate a weekly date range from startDateForRange to endDate.
      const dateRange: { monday: string }[] = [];
      const current = new Date(startDateForRange);
      while (current <= endDate) {
        dateRange.push({ monday: current.toISOString().split('T')[0] });
        current.setDate(current.getDate() + 7);
      }
  
      // Prepare cumulative volume data and dynamic labels.
      const data: number[] = [];
      const labels: string[] = [];
      let cumulativeVolume = 0;
  
      // Determine label format based on the actual data timespan.
      const timespan = endDate.getTime() - startDateForRange.getTime();
      const oneYearInMs = 365 * 24 * 60 * 60 * 1000;
      const labelFormat: 'year' | 'month' = timespan > oneYearInMs ? 'year' : 'month';
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
      dateRange.forEach((week, index) => {
        // Match a row with the current week’s monday.
        const match = rows.find((row) => row.monday === week.monday);
        const weeklyVolume = match ? match.volume : 0;
        cumulativeVolume += weeklyVolume;
        data.push(cumulativeVolume);
  
        const currentDate = new Date(week.monday);
        let label = "";
        if (labelFormat === 'year') {
          // For multi-year spans, show the year when it changes.
          if (index === 0 || currentDate.getFullYear() !== new Date(dateRange[index - 1].monday).getFullYear()) {
            label = currentDate.getFullYear().toString();
          }
        } else {
          // For one-year or less, show the month when it changes.
          if (index === 0 || currentDate.getMonth() !== new Date(dateRange[index - 1].monday).getMonth()) {
            label = monthNames[currentDate.getMonth()];
          }
        }
        labels.push(label);
      });
  
      const exercise = await db.getFirstAsync(
        'SELECT name FROM exercise WHERE id = ?',
        [exerciseId]
      ) as { name: string };
  
      return new ChartDataset(data, labels, exercise.name);
    } catch (error) {
      console.log(error);
      return await this.getEmptyDataset(exerciseId);
    }
  }

}

