/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'thumbnail',
})
export class ThumbnailPipe implements PipeTransform {
  constructor() {
    //
  }

  transform(value: any, ...args: any[]): any {
    return (
      '<img src="' +
      value +
      '" class="lozad" loading="lazy" width="45px" alt="Project" title="Project"/>'
    );
  }
}
