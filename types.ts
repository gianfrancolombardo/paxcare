
export enum PeriodicityUnit {
  Days = 'days',
  Weeks = 'weeks',
  Months = 'months',
  Years = 'years',
}

export interface Periodicity {
  value: number;
  unit: PeriodicityUnit;
}

export interface HistoryEntry {
  id: string;
  date: string; // ISO string
  note?: string;
}

export interface Task {
  id: string;
  key: string;
  title: string;
  note: string;
  periodicity: Periodicity;
  lastCompleted: string | null; // ISO string
  nextDueDate: string | null; // ISO string
  isActive: boolean;
  history: HistoryEntry[];
}

export interface Dog {
  id: string;
  name: string;
  ageYears: number;
  ageMonths: number;
  tasks: Task[];
}

export interface BaseTask {
  key: string;
  title: string;
  note: string;
  periodicity: Periodicity;
  isActive: boolean;
}
