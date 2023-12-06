/* eslint-disable @typescript-eslint/no-explicit-any */
import { SortType } from '@swimlane/ngx-datatable';

export interface ProjectsStoreModel {
  list: {
    // ----------------
    filters?: any;
    // ----------------
    sorts?: any[];
    sortType?: SortType; // multi, // single
    // ----------------
    page: number;
    pageSize: number;
    // ----------------
    groupRows?: boolean;
    groupRowsBy?: string;
    // ----------------
    total?: number;
    // ----------------
    items?: any[];
    selected?: any[];
    // ----------------
  };
  edit: any | null;
}
