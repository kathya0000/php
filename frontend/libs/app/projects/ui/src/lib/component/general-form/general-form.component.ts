/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChangeDetectionStrategy,
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { marker as _i18n } from '@biesbjerg/ngx-translate-extract-marker';
import {
  DynamicCheckboxModel,
  DynamicFormGroupModel,
  DynamicFormLayout,
  DynamicFormModel,
  DynamicInputModel,
  DynamicSelectModel,
  DynamicTextAreaModel,
} from '@ng-dynamic-forms/core';

import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  take,
} from 'rxjs';
import { AbstractUiFormComponent } from '../abstract-form.component';

@Component({
  selector: 'app-projects-ui-general-form',
  templateUrl: './general-form.component.html',
  styleUrls: ['./general-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralFormComponent
  extends AbstractUiFormComponent
  implements OnInit, OnDestroy, OnChanges
{
  // -------------------------------------------------------------------------

  constructor() {
    super();
  }

  // -------------------------------------------------------------------------

  protected override getDefaultOptionsKeys() {
    return [
      // ----------------------------------------------
      'geo_infos_states',
      'geo_infos_cities',
      // ----------------------------------------------
    ];
  }

  protected override getDefaultOptionsLists(): {
    [id: string]: BehaviorSubject<any[]>;
  } {
    return {};
  }

  // -------------------------------------------------------------------------

  protected getFormModel(editable = true): DynamicFormModel {
    return [
      // Id

      new DynamicInputModel({
        id: 'id',
        value: this.initialData?.id,
        required: false,
        inputType: 'hidden',
        readOnly: !editable,
        disabled: !editable,
      }),

      // Reference

      new DynamicInputModel({
        id: 'reference',
        value: this.initialData?.reference,
        label: _i18n('app.projects.ui.form.reference'),
        required: true,
        readOnly: !editable,
        disabled: !editable,
        additional: {
          translate_label: true,
        },
      }),

      // Hr

      new DynamicInputModel({
        id: '$$__hr',
        value: '',
        required: false,
        inputType: 'hidden',
      }),

      // Client

      new DynamicFormGroupModel(
        {
          id: 'client',
          label: this.translatePipe.transform(
            _i18n('app.projects.ui.form.client.header')
          ),
          group: [
            // Hr

            new DynamicInputModel({
              id: '$$__hr',
              value: '',
              required: false,
              inputType: 'hidden',
            }),

            // Client name

            new DynamicInputModel({
              id: 'first_name',
              value: this.initialData?.client?.first_name,
              label: _i18n('app.projects.ui.form.client.first_name'),
              required: true,
              readOnly: !editable,
              disabled: !editable,
              additional: {
                translate_label: true,
              },
              validators: {
                required: null,
              },
            }),

            // Client last_name

            new DynamicInputModel({
              id: 'last_name',
              value: this.initialData?.client?.last_name,
              label: _i18n('app.projects.ui.form.client.last_name'),
              required: false,
              readOnly: !editable,
              disabled: !editable,
              additional: {
                translate_label: true,
              },
            }),

            // Client company

            new DynamicInputModel({
              id: 'company',
              value: this.initialData?.client?.company,
              label: _i18n('app.projects.ui.form.client.company'),
              required: false,
              readOnly: !editable,
              disabled: !editable,
              additional: {
                translate_label: true,
              },
            }),

            // Client email

            new DynamicInputModel({
              id: 'email',
              value: this.initialData?.client?.email,
              label: _i18n('app.projects.ui.form.client.email'),
              inputType: 'email',
              required: false,
              readOnly: !editable,
              disabled: !editable,
              validators: {
                email: null,
              },
              additional: {
                translate_label: true,
              },
            }),

            // Client cellphone

            new DynamicInputModel({
              id: 'cellphone',
              value: this.initialData?.client?.cellphone,
              label: _i18n('app.projects.ui.form.client.cellphone'),
              required: false,

              readOnly: !editable,
              disabled: !editable,
              additional: {
                translate_label: true,
              },
            }),

            // Client nif

            new DynamicInputModel({
              id: 'nif',
              value: this.initialData?.client?.nif,
              label: _i18n('app.projects.ui.form.client.nif'),
              required: false,
              readOnly: !editable,
              disabled: !editable,
              additional: {
                translate_label: true,
              },
            }),
          ],
        },
        {
          element: {
            host: '',
            container: '',
            children: '',
          },
          grid: {
            host: '',
            container: '',
            children: '',
          },
        }
      ),

      // Hr

      new DynamicInputModel({
        id: '$$__hr',
        value: '',
        required: false,
        inputType: 'hidden',
      }),

      // Address

      new DynamicFormGroupModel(
        {
          id: 'address',
          label: this.translatePipe.transform(
            _i18n('app.projects.ui.form.address.header')
          ),
          group: [
            // Hr

            new DynamicInputModel({
              id: '$$__hr',
              value: '',
              required: false,
              inputType: 'hidden',
            }),

            // Address street

            new DynamicInputModel({
              id: 'street',
              value: this.initialData?.address?.street,
              label: _i18n('app.projects.ui.form.address.street'),
              required: false,
              readOnly: !editable,
              disabled: !editable,
              additional: {
                translate_label: true,
              },
            }),

            // Address additional

            new DynamicInputModel({
              id: 'additional',
              value: this.initialData?.address?.additional,
              label: _i18n('app.projects.ui.form.address.additional'),
              required: false,
              readOnly: !editable,
              disabled: !editable,
              additional: {
                translate_label: true,
              },
            }),

            // Address country

            new DynamicInputModel({
              id: 'country_code',
              value: this.initialData?.address?.country_code,
              inputType: 'hidden',
              label: _i18n('app.projects.ui.form.address.country'),
              required: false,
              readOnly: !editable,
              disabled: !editable,
              additional: {
                translate_label: true,
              },
            }),

            // Address region

            new DynamicInputModel({
              id: 'region_code',
              value: this.initialData?.address?.region_code,
              inputType: 'hidden',
              label: _i18n('app.projects.ui.form.address.region'),
              required: false,
              readOnly: !editable,
              disabled: !editable,
              additional: {
                translate_label: true,
              },
            }),

            // Address state

            new DynamicSelectModel<string>({
              id: 'state_code',
              value: this.initialData?.address?.state_code,
              label: _i18n('app.projects.ui.form.address.state'),
              required: false,
              disabled: !editable,
              options: this.optionsLists['geo_infos_states$'],
              additional: {
                translate_label: true,
                use_ng_select: true,
                use_ng_select__clearable: false,
              },
            }),

            // Address city

            new DynamicSelectModel<string>({
              id: 'city_code',
              value: this.initialData?.address?.city_code,
              label: _i18n('app.projects.ui.form.address.city'),
              required: false,
              disabled: !editable,
              options: this.optionsLists['geo_infos_cities$'],
              additional: {
                translate_label: true,
                use_ng_select: false,
                use_ng_select__clearable: false,
              },
            }),

            // Address postal code

            new DynamicInputModel({
              id: 'postal_code',
              value: this.initialData?.address?.postal_code,
              label: _i18n('app.projects.ui.form.address.postal_code'),
              required: false,
              readOnly: !editable,
              disabled: !editable,
              additional: {
                translate_label: true,
              },
            }),

            // Hr

            new DynamicInputModel({
              id: '$$__hr',
              value: '',
              required: false,
              inputType: 'hidden',
            }),

            // Address has elevator

            new DynamicCheckboxModel({
              id: 'has_elevator',
              value: this.initialData?.address?.has_elevator === true,
              label: _i18n('app.projects.ui.form.address.has_elevator'),
              required: false,
              disabled: !editable,
              additional: {
                translate_label: true,
              },
            }),
          ],
        },
        {
          element: {
            host: '',
            container: '',
            children: '',
          },
          grid: {
            host: '',
            container: '',
            children: '',
          },
        }
      ),

      // Hr

      new DynamicInputModel({
        id: '$$__hr',
        value: '',
        required: false,
        inputType: 'hidden',
      }),

      // Description

      new DynamicTextAreaModel({
        id: 'description',
        value: this.initialData?.description,
        label: _i18n('app.projects.ui.form.description'),
        required: false,
        readOnly: !editable,
        disabled: !editable,
        rows: 5,
        additional: {
          translate_label: true,
        },
      }),

      // Hr

      new DynamicInputModel({
        id: '$$__hr',
        value: '',
        required: false,
        inputType: 'hidden',
      }),

      // -----------------------------------------------
    ];
  }

  protected getFormLayout(editable = true): DynamicFormLayout {
    return {
      $$__hr: {
        element: {
          host: 'col-md-12 col-sm-12 col-xs-12',
        },
        grid: {
          host: 'col-md-12 col-sm-12 col-xs-12',
        },
      },
      $$__br: {
        element: {
          host: 'col-md-12 col-sm-12 col-xs-12',
        },
        grid: {
          host: 'col-md-12 col-sm-12 col-xs-12',
        },
      },
      id: {
        element: {
          host: 'd-none',
        },
        grid: {
          host: 'd-none',
        },
      },
      reference: {
        element: {
          host: 'col-md-6 col-sm-12 col-xs-12 input-required',
          label: editable ? 'input-required' : '',
        },
        grid: {
          host: 'col-md-6 col-sm-12 col-xs-12 input-required',
          label: editable ? 'input-required' : '',
        },
      },

      first_name: {
        element: {
          host: 'col-md-4 col-sm-6 col-xs-12',
          label: editable ? 'input-required' : '',
        },
        grid: {
          host: 'col-md-4 col-sm-6 col-xs-12',
          label: editable ? 'input-required' : '',
        },
      },
      last_name: {
        element: {
          host: 'col-md-4 col-sm-6 col-xs-12',
        },
        grid: {
          host: 'col-md-4 col-sm-6 col-xs-12',
        },
      },
      company: {
        element: {
          host: 'col-md-4 col-sm-6 col-xs-12',
        },
        grid: {
          host: 'col-md-4 col-sm-6 col-xs-12',
        },
      },
      email: {
        element: {
          host: 'col-md-6 col-sm-6 col-xs-12',
        },
        grid: {
          host: 'col-md-6 col-sm-6 col-xs-12',
        },
      },
      cellphone: {
        element: {
          host: 'col-md-3 col-sm-6 col-xs-12',
        },
        grid: {
          host: 'col-md-3 col-sm-6 col-xs-12',
        },
      },
      nif: {
        element: {
          host: 'col-md-3 col-sm-6 col-xs-12',
        },
        grid: {
          host: 'col-md-3 col-sm-6 col-xs-12',
        },
      },
      street: {
        element: {
          host: 'col-md-8 col-sm-12 col-xs-12',
        },
        grid: {
          host: 'col-md-8 col-sm-12 col-xs-12',
        },
      },
      additional: {
        element: {
          host: 'col-md-4 col-sm-6 col-xs-12',
        },
        grid: {
          host: 'col-md-4 col-sm-6 col-xs-12',
        },
      },
      country_code: {
        element: {
          host: 'd-none',
        },
        grid: {
          host: 'd-none',
        },
      },
      region_code: {
        element: {
          host: 'd-none',
        },
        grid: {
          host: 'd-none',
        },
      },
      state_code: {
        element: {
          host: 'col-md-4 col-sm-6 col-xs-12',
        },
        grid: {
          host: 'col-md-4 col-sm-6 col-xs-12',
        },
      },
      city_code: {
        element: {
          host: 'col-md-4 col-sm-6 col-xs-12',
        },
        grid: {
          host: 'col-md-4 col-sm-6 col-xs-12',
        },
      },
      postal_code: {
        element: {
          host: 'col-md-4 col-sm-6 col-xs-12',
        },
        grid: {
          host: 'col-md-4 col-sm-6 col-xs-12',
        },
      },
      has_elevator: {
        element: {
          host: 'col-md-12 col-sm-12 col-xs-12',
        },
        grid: {
          host: 'col-md-12 col-sm-12 col-xs-12',
        },
      },
      description: {
        element: {
          host: 'col-sm-12 col-sm-12 col-xs-12',
        },
        grid: {
          host: 'col-sm-12 col-sm-12 col-xs-12',
        },
      },
    };
  }

  protected getOptionsListsData(editable = true): {
    [id: string]: BehaviorSubject<any[]>;
  } {
    const optionsSubscribers: any = {};

    this.optionsKeys.forEach((optionsKey) => {
      optionsSubscribers[optionsKey + '$'] = new BehaviorSubject<any[]>([]);
      this.startLoader('Add-Edit-Project-Form-Options-' + optionsKey);
    });

    this.optionsListsService
      .getOptionsLists(this.optionsKeys, { orderByLabelAlphabetical: true })
      .results?.forEach((result) => {
        this.addSubscription(
          result.options$.pipe(take(1)).subscribe((options) => {
            // optionsSubscribers[optionsResult.key + '$']
            optionsSubscribers[result.fullKey + '$'].next([
              { label: '', value: '', item: {} },
              ...options,
            ]);
            this.endLoader('Add-Edit-Project-Form-Options-' + result.fullKey);
          })
        );
      });

    return optionsSubscribers;
  }

  // -------------------------------------------------------------------------

  protected onFormGroupCreated(event: any): void {
    const formCreated: FormGroup = event as FormGroup;

    formCreated.patchValue(this.initialData, {
      emitEvent: false,
    });

    this.addSubscription(
      formCreated
        .get('address')
        ?.get('state_code')
        ?.valueChanges.pipe(debounceTime(200), distinctUntilChanged())
        .subscribe(() => {
          if (
            this.editable &&
            formCreated.get('address')?.get('state_code')?.dirty
          ) {
            formCreated.get('address')?.get('city_code')?.setValue('');
            this.startLoader('Add-Edit-Address-STATE-CITY');
          }

          const value: string | null = formCreated
            .get('address')
            ?.get('state_code')?.value;

          const optionsKeyByStateCode =
            'geo_infos_cities' + '__' + (value && value !== '' ? value : '---');

          const optionsKeys = [optionsKeyByStateCode];

          this.optionsListsService
            .getOptionsLists(optionsKeys, { orderByLabelAlphabetical: true })
            .results?.forEach((optionsResult) => {
              this.addSubscription(
                optionsResult.options$.pipe(take(1)).subscribe((options) => {
                  this.endLoader('Add-Edit-Address-STATE-CITY');
                  this.optionsLists[optionsResult.key + '$'].next([
                    { label: '', value: '', item: {} },
                    ...options,
                  ]);

                  setTimeout(() => {
                    this.formService.detectChanges();
                  }, 100);
                })
              );
            });
        })
    );

    formCreated
      .get('address')
      ?.get('state_code')
      ?.setValue(formCreated.get('address')?.get('state_code')?.value);

    this.formGroupCreated.emit(event as FormGroup);
  }

  // -------------------------------------------------------------------------
}
