import { InjectionToken } from '@angular/core';

export const BASE_PATH = new InjectionToken<string>('LARAVEL9_API_BASE_PATH');

export const COLLECTION_FORMATS = {
  csv: ',',
  tsv: '   ',
  ssv: ' ',
  pipes: '|',
};
