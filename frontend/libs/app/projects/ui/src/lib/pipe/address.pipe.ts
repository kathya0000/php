/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'address',
})
export class AddressPipe implements PipeTransform {
  private sanitizer: DomSanitizer = inject<DomSanitizer>(DomSanitizer);

  constructor() {
    //
  }

  transform(value: any, ...args: any[]): any {
    return this.sanitizer.bypassSecurityTrustHtml(
      value.street +
        ' (' +
        value.city_code +
        ', ' +
        value.state_code +
        ')'
    );
  }
}
