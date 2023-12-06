/* eslint-disable @typescript-eslint/no-unused-vars */
import { CurrencyPipe } from '@angular/common';
import { Pipe, PipeTransform, inject } from '@angular/core';

@Pipe({
  name: 'budget',
})
export class BudgetPipe implements PipeTransform {
  private currency: CurrencyPipe = inject<CurrencyPipe>(CurrencyPipe);
  constructor() {
    //
  }

  transform(value: string, ...args: unknown[]): string | null {
    return this.currency.transform(value, 'EUR', 'symbol-narrow', '1.2-2');
  }
}
