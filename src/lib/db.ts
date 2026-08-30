import Dexie, { type Table } from 'dexie';
import type { Meeting } from '../types';

export class RelatoriaDatabase extends Dexie {
  meetings!: Table<Meeting, number>;

  constructor() {
    super('RelatoriaNADatabase');
    this.version(1).stores({
      meetings: '++id, group_id, meeting_date, meeting_type'
    });
  }
}

export const db = new RelatoriaDatabase();
