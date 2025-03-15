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
      data = await this.getEstimated1RM(exercise.id, Math.round(graphDuration.days / 7));
    }

    if (graphType.id == 2) {
      data = await this.getVolume(exercise.id, Math.round(graphDuration.days / 7));
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

      rows.reverse();

      const data: number[] = [];
      const labels: string[] = [];

      if (rows.length > 0) {
        const firstDate = new Date(rows[0].monday);
        const lastDate = new Date(rows[rows.length - 1].monday);
        const oneYearInMs = 365 * 24 * 60 * 60 * 1000;
        const labelFormat = (lastDate.getTime() - firstDate.getTime() > oneYearInMs) ? 'year' : 'month';

        rows.forEach((row, index) => {
          data.push(row.estimated1RM);
          const currentDate = new Date(row.monday);

          if (labelFormat === 'year') {
            if (index === 0 || currentDate.getFullYear() !== new Date(rows[index - 1].monday).getFullYear()) {
              labels.push(currentDate.getFullYear().toString());
            } else {
              labels.push('');
            }
          } else {
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            if (index === 0 || currentDate.getMonth() !== new Date(rows[index - 1].monday).getMonth()) {
              labels.push(monthNames[currentDate.getMonth()]);
            } else {
              labels.push('');
            }
          }
        });
      } else {
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

      const computedStartDate = new Date(endDate);
      computedStartDate.setDate(endDate.getDate() - weeks * 7);

      function getSqlMonday(date: Date): Date {
        const day = date.getDay();
        const diff = day === 0 ? 1 : 1 - day;
        const monday = new Date(date);
        monday.setDate(date.getDate() + diff);
        return monday;
      }

      const startMonday = getSqlMonday(computedStartDate);

      const rows = await db.getAllAsync(
        `
        SELECT strftime('%Y-%m-%d', w.endtime, 'weekday 0', '-6 days') as monday, 
               SUM(es.amount * es.weight) as volume
        FROM exerciseset es
        JOIN batch b ON es.batchid = b.id
        JOIN workout w ON b.workoutid = w.id
        WHERE es.exerciseid = ?
          AND w.endtime >= ?
        GROUP BY monday
        ORDER BY monday ASC
        `,
        [exerciseId, computedStartDate.toISOString()]
      ) as { monday: string; volume: number }[];

      const dateRange: { monday: string }[] = [];
      const current = new Date(startMonday);
      while (current <= endDate) {
        dateRange.push({ monday: current.toISOString().split('T')[0] });
        current.setDate(current.getDate() + 7);
      }

      const data: number[] = [];
      const labels: string[] = [];
      let cumulativeVolume = 0;

      const timespan = endDate.getTime() - startMonday.getTime();
      const oneYearInMs = 365 * 24 * 60 * 60 * 1000;
      const labelFormat: 'year' | 'month' = timespan > oneYearInMs ? 'year' : 'month';
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

      dateRange.forEach((week, index) => {
        const match = rows.find((row) => row.monday === week.monday);
        const weeklyVolume = match ? match.volume : 0;
        cumulativeVolume += weeklyVolume;
        data.push(cumulativeVolume);

        const currentDate = new Date(week.monday);
        let label = "";
        if (labelFormat === 'year') {
          if (index === 0 || currentDate.getFullYear() !== new Date(dateRange[index - 1].monday).getFullYear()) {
            label = currentDate.getFullYear().toString();
          }
        } else {
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

