/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { AbstractAddEditComponent } from '../abstract-add-edit/abstract-add-edit.component';

@Component({
  templateUrl: './../abstract-add-edit/abstract-add-edit.component.html',
  styleUrls: ['./../abstract-add-edit/abstract-add-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddComponent
  extends AbstractAddEditComponent
  implements OnInit, OnDestroy
{
  constructor() {
    super();
    this.elementIsNew = true;
  }

  protected override getProjectInitialData(): any {
    if (this.__isDevMode) {
      const seed = Math.floor(Math.random() * 10000);
      const value =
        seed < 1000 ? seed + 1000 : seed > 10000 ? seed - 1000 : seed;
      return {
        id: null,
        reference: 'Reference - ' + value,
        client: {
          first_name: 'First Name ' + value,
          last_name: 'Last Name ' + value,
          nif: 'X0101011A',
          company: 'Company ' + value,
          cellphone: '600 123 ' + value,
          email: 'email' + value + '@local.com',
        },
        address: {
          street: 'Street ' + value,
          additional: '5A',
          country_code: 'ES',
          region_code: '',
          state_code: '',
          city_code: '',
          postal_code: '01001',
          has_elevator: false,
        },
        description:
          'Some description - ' + value + ' - ' + new Date().toUTCString(),
      };
    }

    return {};
  }

  protected override isVisibleTab_SPACES(): boolean | undefined | null {
    return this.__isDevMode;
  }

  protected override isDisabledTab_SPACES(): boolean | undefined | null {
    return !this.__isDevMode;
  }
}
