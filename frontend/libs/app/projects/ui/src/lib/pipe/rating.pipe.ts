/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'rating',
})
export class RatingPipe implements PipeTransform {

  constructor() {
    //
  }
  
  transform(value: number, ...args: unknown[]): any {
    let display = '';
    [1, 2, 3, 4, 5].forEach((s) => {
      display +=
        '<i class="fa fa-star' +
        (s <= value ? '' : '-o') +
        '" title="' +
        s +
        '"></i>&nbsp;';
    });
    return display;
  }
}
