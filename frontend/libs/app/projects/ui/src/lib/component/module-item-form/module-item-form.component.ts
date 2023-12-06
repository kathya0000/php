/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { marker as _i18n } from '@biesbjerg/ngx-translate-extract-marker';
import {
  AND_OPERATOR,
  DynamicCheckboxModel,
  DynamicFormArrayModel,
  DynamicFormControlModel,
  DynamicFormLayout,
  DynamicFormModel,
  DynamicInputModel,
  DynamicSelectModel,
  MATCH_REQUIRED,
  MATCH_VISIBLE,
} from '@ng-dynamic-forms/core';
import {
  BehaviorSubject,
  Observable,
  debounceTime,
  distinctUntilChanged,
  of,
  take,
} from 'rxjs';
import { AbstractUiFormComponent } from '../abstract-form.component';

@Component({
  selector: 'app-projects-ui-module-item-form',
  templateUrl: './module-item-form.component.html',
  styleUrls: ['./module-item-form.component.scss'],
})
export class ModuleItemFormComponent
  extends AbstractUiFormComponent
  implements OnInit, OnDestroy, OnChanges
{
  // -------------------------------------------------------------------------

  _internalFormModel!: DynamicFormModel;

  // -------------------------------------------------------------------------

  @Input() context!: DynamicFormArrayModel;

  @Input() group!: DynamicInputModel[];

  @Input() index!: number;

  // -------------------------------------------------------------------------

  protected optionsForMechanismsIdsUUIDs: any[] = [];

  protected optionsForMechanismsIds: {
    options: any[];
    options$: Observable<any[]>;
    control: FormControl;
    model: DynamicFormControlModel;
  }[] = [];

  // -------------------------------------------------------------------------

  constructor() {
    super();
  }

  // -------------------------------------------------------------------------

  protected override getDefaultOptionsKeys() {
    return [
      // ----------------------------------------------
      // ----------------------------------------------
    ];
  }

  protected override getDefaultOptionsLists(): {
    [id: string]: BehaviorSubject<any[]>;
  } {
    return {};
  }

  // -------------------------------------------------------------------------

  private getFieldsIds(): string[] {
    return [
      'module_wall_identifier',
      'module_reference_point',
      'module_keep_existing_installation',
      'module_make_new_installation',
      'module_distance_to_reference_point',
      'module_bottom_height',
      // 'module_trenches_top_height',
      'module_trenches_count',
      'module_trenches_direction',
      'mechanisms',
      'module_frame_new_id',
      'module_frame_new_price',
      'module_frame_new_iva_percent',
      'module_frame_installation_price',
      'module_frame_installation_iva_percent',
    ];
  }

  override onInitOrOnChanges(changes: SimpleChanges) {
    if (this.group) {
      this.initialData = {};

      this.getFieldsIds().forEach((id) => {
        const find = this.group.find((item) => item.id === id);
        if (find) {
          this.initialData['_' + id] =
            find.value !== null && find.value !== undefined ? find.value : '';
        }
      });
    }

    super.onInitOrOnChanges(changes);
  }

  // -------------------------------------------------------------------------

  protected getFormModel(editable = true): DynamicFormModel {
    return [
      // -----------------------------------------------

      // Wall identifier

      new DynamicSelectModel<string>({
        id: '_module_wall_identifier',
        value: 'A - B',
        required: true,
        label: _i18n('app.projects.ui.form.spaces.modules.wall'),
        disabled: !editable,
        options: this.optionsLists['walls_identifiers$'].asObservable(),
        additional: {
          translate_label: true,
        },
      }),

      // Keep Existing Installation

      new DynamicCheckboxModel({
        id: '_module_keep_existing_installation',
        value: true,
        required: false,
        label: _i18n(
          'app.projects.ui.form.spaces.modules.keep_existing_installation'
        ),
        disabled: !editable,
        additional: {
          translate_label: true,
        },
      }),

      // New Installation

      new DynamicCheckboxModel({
        id: '_module_make_new_installation',
        value: false,
        required: false,
        label: _i18n('app.projects.ui.form.spaces.modules.new_installation'),
        disabled: !editable,
        additional: {
          translate_label: true,
        },
      }),

      // Reference Point

      new DynamicSelectModel<string>({
        id: '_module_reference_point',
        value: 'A',
        required: true,
        label: _i18n('app.projects.ui.form.spaces.modules.reference_point'),
        disabled: !editable,
        options: [],
        additional: {
          translate_label: true,
        },
      }),

      // Distance to Reference Point

      new DynamicInputModel({
        id: '_module_distance_to_reference_point',
        inputType: 'number',
        value: 500,
        required: true,
        label: _i18n(
          'app.projects.ui.form.spaces.modules.distance_to_reference_point'
        ),
        readOnly: !editable,
        disabled: !editable,

        validators: {
          required: null,
          min: 0,
        },
        additional: {
          translate_label: true,
        },
      }),

      // Distance to Floor

      new DynamicInputModel({
        id: '_module_bottom_height',
        inputType: 'number',
        value: 500,
        required: true,
        label: _i18n('app.projects.ui.form.spaces.modules.under_height'),
        readOnly: !editable,
        disabled: !editable,
        validators: {
          required: null,
          min: 0,
        },
        additional: {
          translate_label: true,
        },
      }),

      // Distance to Ceiling

      /*
      new DynamicInputModel({
        id: '_module_trenches_top_height',
        inputType: 'number',
        value: 1500,
        required: true,
        label: _i18n('app.projects.ui.form.spaces.modules.top_height'),
        readOnly: !editable,
        disabled: !editable,
        validators: {
          required: null,
          min: 0,
        },
        additional: {
          translate_label: true,
        },
      }),
      */

      // Trenches Count

      new DynamicInputModel({
        id: '_module_trenches_count',
        inputType: 'number',
        value: 1,
        required: true,
        label: _i18n('app.projects.ui.form.spaces.modules.trenches_count'),
        readOnly: !editable,
        disabled: !editable,
        validators: {
          required: null,
          min: 1,
        },
        additional: {
          translate_label: true,
        },
      }),

      // Trenches Direction LEFT RIGHT

      new DynamicSelectModel<string>({
        id: '_module_trenches_direction',
        value: 'NONE',
        required: false,
        label: _i18n('app.projects.ui.form.spaces.modules.trenches_direction'),
        disabled: !editable,
        options:
          this.optionsLists['modules_trenches_directions$'].asObservable(),
        additional: {
          translate_label: true,
        },
      }),

      // mechanisms

      new DynamicFormArrayModel(
        {
          id: '_mechanisms',
          label: this.translatePipe.transform(
            _i18n('app.projects.ui.form.spaces.mechanisms.header')
          ),
          initialCount:
            this.initialData?._mechanisms &&
            this.initialData?._mechanisms?.length > 0
              ? this.initialData?._mechanisms?.length
              : 1,
          groupFactory: () => {
            return [
              // Mechanism Show Price

              new DynamicInputModel({
                id: 'module_mechanism_show_price',
                value: 0,
                required: false,
                inputType: 'hidden',
                readOnly: !editable,
                disabled: !editable,
              }),

              // New Mechanism Type Id

              new DynamicSelectModel<string>({
                id: 'module_mechanism_category_id',
                value: '',
                required: true,
                label: _i18n(
                  'app.projects.ui.form.spaces.mechanisms.mechanism_new_category_id'
                ),
                disabled: !editable,
                options:
                  this.optionsLists[
                    'products_categories__electrical_mechanisms$'
                  ].asObservable(),
                additional: {
                  translate_label: true,
                },
                relations: [],
              }),

              // New Mechanism Type Id

              new DynamicSelectModel<string>({
                id: 'module_mechanism_new_id',
                value: '',
                required: true,
                label: _i18n(
                  'app.projects.ui.form.spaces.mechanisms.mechanism_new_id'
                ),
                filterable: true,
                disabled: !editable,
                options: [],
                additional: {
                  translate_label: true,
                  use_ng_select: true,
                  use_ng_select__clearable: false,
                },
                relations: [],
              }),

              // Mechanism Price

              new DynamicInputModel({
                id: 'module_mechanism_new_price',
                value: '0.00',
                required: true,
                label: _i18n(
                  'app.projects.ui.form.spaces.mechanisms.mechanism_new_price'
                ),
                readOnly: !editable,
                disabled: !editable,
                additional: {
                  translate_label: true,
                  onblur_parse_value_to_float_with_fixed: 2,
                },
                validators: {
                  min: 0,
                },
                relations: [
                  {
                    match: MATCH_REQUIRED,
                    operator: AND_OPERATOR,
                    when: [
                      {
                        id: 'module_mechanism_show_price',
                        value: true,
                      },
                    ],
                  },
                  {
                    match: MATCH_VISIBLE,
                    operator: AND_OPERATOR,
                    when: [
                      {
                        id: 'module_mechanism_show_price',
                        value: true,
                      },
                    ],
                  },
                ],
              }),

              new DynamicInputModel({
                id: 'module_mechanism_new_iva_percent',
                value: '0.00',
                required: false,
                inputType: 'hidden',
                readOnly: !editable,
                disabled: !editable,
              }),

              // Mechanism Price

              new DynamicInputModel({
                id: 'module_mechanism_installation_price',
                value: '0.00',
                required: true,
                label: _i18n(
                  'app.projects.ui.form.spaces.mechanisms.mechanism_new_installation_price'
                ),
                readOnly: !editable,
                disabled: !editable,
                additional: {
                  translate_label: true,
                  onblur_parse_value_to_float_with_fixed: 2,
                },
                validators: {
                  min: 0,
                },
                relations: [
                  {
                    match: MATCH_REQUIRED,
                    operator: AND_OPERATOR,
                    when: [
                      {
                        id: 'module_mechanism_show_price',
                        value: true,
                      },
                    ],
                  },
                  {
                    match: MATCH_VISIBLE,
                    operator: AND_OPERATOR,
                    when: [
                      {
                        id: 'module_mechanism_show_price',
                        value: true,
                      },
                    ],
                  },
                ],
              }),

              new DynamicInputModel({
                id: 'module_mechanism_installation_iva_percent',
                value: '0.00',
                required: false,
                inputType: 'hidden',
                readOnly: !editable,
                disabled: !editable,
              }),
            ];
          },
        },
        {
          element: {
            host: 'spaces_form_modules_sub_form_mechanisms_array_host pt-3 pb-3 mt-2 mb-2 m-auto',
            container: '',
            children: '',
          },
          grid: {
            host: 'spaces_form_modules_sub_form_mechanisms_array_host pt-3 pb-3 mt-2 mb-2 m-auto',
            container: '',
            children: '',
          },
        }
      ),

      // New Frame Type Id

      new DynamicSelectModel<string>({
        id: '_module_frame_new_id',
        value: '',
        required: true,
        label: _i18n('app.projects.ui.form.spaces.modules.frame_new_id'),
        disabled: !editable,
        options:
          this.optionsLists[
            'products_electrical_mechanisms__frames$'
          ].asObservable(),
        additional: {
          translate_label: true,
        },
        relations: [
          {
            match: MATCH_REQUIRED,
            operator: AND_OPERATOR,
            when: [
              {
                id: '_module_make_new_installation',
                value: true,
              },
            ],
          },
          {
            match: MATCH_VISIBLE,
            operator: AND_OPERATOR,
            when: [
              {
                id: '_module_make_new_installation',
                value: true,
              },
            ],
          },
        ],
      }),

      // Frame Price

      new DynamicInputModel({
        id: '_module_frame_new_price',
        value: '0.00',
        required: true,
        label: _i18n('app.projects.ui.form.spaces.modules.frame_new_price'),
        readOnly: !editable,
        disabled: !editable,
        additional: {
          translate_label: true,
          onblur_parse_value_to_float_with_fixed: 2,
        },
        relations: [
          {
            match: MATCH_REQUIRED,
            operator: AND_OPERATOR,
            when: [
              {
                id: '_module_make_new_installation',
                value: true,
              },
            ],
          },
          {
            match: MATCH_VISIBLE,
            operator: AND_OPERATOR,
            when: [
              {
                id: '_module_make_new_installation',
                value: true,
              },
            ],
          },
        ],
      }),

      new DynamicInputModel({
        id: '_module_frame_new_iva_percent',
        value: '0.00',
        required: false,
        inputType: 'hidden',
        readOnly: !editable,
        disabled: !editable,
      }),

      // Frame Installation Price

      new DynamicInputModel({
        id: '_module_frame_installation_price',
        value: '0.00',
        required: true,
        label: _i18n(
          'app.projects.ui.form.spaces.modules.frame_new_labour_price'
        ),
        readOnly: !editable,
        disabled: !editable,
        additional: {
          translate_label: true,
          onblur_parse_value_to_float_with_fixed: 2,
        },
        relations: [
          {
            match: MATCH_REQUIRED,
            operator: AND_OPERATOR,
            when: [
              {
                id: '_module_make_new_installation',
                value: true,
              },
            ],
          },
          {
            match: MATCH_VISIBLE,
            operator: AND_OPERATOR,
            when: [
              {
                id: '_module_make_new_installation',
                value: true,
              },
            ],
          },
        ],
      }),

      new DynamicInputModel({
        id: '_module_frame_installation_iva_percent',
        value: '0.00',
        required: false,
        inputType: 'hidden',
        readOnly: !editable,
        disabled: !editable,
      }),

      // -----------------------------------------------
    ];
  }

  protected getFormLayout(editable = true): DynamicFormLayout {
    return {
      // ---------------------------------------------
      $$__hr: {
        element: {
          host: 'col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12',
        },
        grid: {
          host: 'col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12',
        },
      },
      $$__br: {
        element: {
          host: 'col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12',
        },
        grid: {
          host: 'col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12',
        },
      },
      // ---------------------------------------------
      _module_wall_identifier: {
        element: {
          host: 'col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-12',
          label: editable ? 'input-required' : '',
        },
        grid: {
          host: 'col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-12',
          label: editable ? 'input-required' : '',
        },
      },
      _module_keep_existing_installation: {
        element: {
          host: 'col-xl-3 col-lg-3 col-md-4 col-sm-4 col-xs-12 pt-4',
        },
        grid: {
          host: 'col-xl-3 col-lg-3 col-md-4 col-sm-4 col-xs-12 pt-4',
        },
      },
      _module_make_new_installation: {
        element: {
          host: 'col-xl-7 col-lg-7 col-md-4 col-sm-4 col-xs-12 pt-4',
        },
        grid: {
          host: 'col-xl-7 col-lg-7 col-md-4 col-sm-4 col-xs-12 pt-4',
        },
      },
      _module_reference_point: {
        element: {
          host: 'col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-12',
          label: editable ? 'input-required' : '',
        },
        grid: {
          host: 'col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-12',
          label: editable ? 'input-required' : '',
        },
      },
      _module_distance_to_reference_point: {
        element: {
          host: 'col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-12',
          label: editable ? 'input-required' : '',
        },
        grid: {
          host: 'col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-12',
          label: editable ? 'input-required' : '',
        },
      },
      _module_bottom_height: {
        element: {
          host: 'col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-12',
          label: editable ? 'input-required' : '',
        },
        grid: {
          host: 'col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-12',
          label: editable ? 'input-required' : '',
        },
      },
      /*
      _module_trenches_top_height: {
        element: {
          host: 'col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-12',
          label: editable ? 'input-required' : '',
        },
        grid: {
          host: 'col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-12',
          label: editable ? 'input-required' : '',
        },
      },
      */
      _module_trenches_count: {
        element: {
          host: 'col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-12',
          label: editable ? 'input-required' : '',
        },
        grid: {
          host: 'col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-12',
          label: editable ? 'input-required' : '',
        },
      },
      _module_trenches_direction: {
        element: {
          host: 'col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-12 d-none',
          label: editable ? 'input-required' : '',
        },
        grid: {
          host: 'col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-12 d-none',
          label: editable ? 'input-required' : '',
        },
      },
      _module_frame_new_id: {
        element: {
          host: 'col-xl-8 col-lg-8 col-md-6 col-sm-12 col-xs-12',
          label: editable ? 'input-required' : '',
        },
        grid: {
          host: 'col-xl-8 col-lg-8 col-md-6 col-sm-12 col-xs-12',
          label: editable ? 'input-required' : '',
        },
      },
      _module_frame_new_price: {
        element: {
          host: 'col-xl-2 col-lg-2 col-md-3 col-sm-6 col-xs-12',
          label: editable ? 'input-required' : '',
        },
        grid: {
          host: 'col-xl-2 col-lg-2 col-md-3 col-sm-6 col-xs-12',
          label: editable ? 'input-required' : '',
        },
      },
      _module_frame_new_iva_percent: {
        element: {
          host: 'd-none',
        },
        grid: {
          host: 'd-none',
        },
      },
      _module_frame_installation_price: {
        element: {
          host: 'col-xl-2 col-lg-2 col-md-3 col-sm-6 col-xs-12',
          label: editable ? 'input-required' : '',
        },
        grid: {
          host: 'col-xl-2 col-lg-2 col-md-3 col-sm-6 col-xs-12',
          label: editable ? 'input-required' : '',
        },
      },
      _module_frame_installation_iva_percent: {
        element: {
          host: 'd-none',
        },
        grid: {
          host: 'd-none',
        },
      },
      // ---------------------------------------------
      module_mechanism_show_price: {
        element: {
          host: 'd-none',
        },
        grid: {
          host: 'd-none',
        },
      },
      module_mechanism_category_id: {
        element: {
          host: 'col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-12',
          label: editable ? 'input-required' : '',
        },
        grid: {
          host: 'col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-12',
          label: editable ? 'input-required' : '',
        },
      },
      module_mechanism_new_id: {
        element: {
          host: 'col-xl-6 col-lg-6 col-md-8 col-sm-8 col-xs-12',
          label: editable ? 'input-required' : '',
        },
        grid: {
          host: 'col-xl-6 col-lg-6 col-md-8 col-sm-8 col-xs-12',
          label: editable ? 'input-required' : '',
        },
      },
      module_mechanism_new_price: {
        element: {
          host: 'col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-12',
          label: editable ? 'input-required' : '',
        },
        grid: {
          host: 'col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-12',
          label: editable ? 'input-required' : '',
        },
      },
      module_mechanism_new_iva_percent: {
        element: {
          host: 'd-none',
        },
        grid: {
          host: 'd-none',
        },
      },
      module_mechanism_installation_price: {
        element: {
          host: 'col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-12',
          label: editable ? 'input-required' : '',
        },
        grid: {
          host: 'col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-12',
          label: editable ? 'input-required' : '',
        },
      },
      module_mechanism_installation_iva_percent: {
        element: {
          host: 'd-none',
        },
        grid: {
          host: 'd-none',
        },
      },
      // ---------------------------------------------
    };
  }

  protected getOptionsListsData(editable = true): {
    [id: string]: BehaviorSubject<any[]>;
  } {
    const optionsSubscribers: any = {};

    return optionsSubscribers;
  }

  // -------------------------------------------------------------------------

  protected onFormGroupCreated(event: any): void {
    const formCreated: FormGroup = event as FormGroup;

    formCreated.patchValue(this.initialData, {
      emitEvent: false,
    });

    // update parent form in child values change

    this.getFieldsIds().forEach((id) => {
      this.addSubscription(
        formCreated
          .get('_' + id)
          ?.valueChanges.pipe(debounceTime(200), distinctUntilChanged())
          .subscribe(() => {
            if (this.group) {
              const find = this.group.find((item) => item.id === id);
              if (find) {
                const formValue = formCreated.getRawValue();
                find.value = formValue['_' + id];
              }
            }
          })
      );
    });

    // modules events

    const wallIdentifierFormControl = formCreated.get(
      '_module_wall_identifier'
    ) as FormControl;

    const referencePointFormControl = formCreated.get(
      '_module_reference_point'
    ) as FormControl;

    const keepExistingInstallationFormControl = formCreated.get(
      '_module_keep_existing_installation'
    ) as FormControl;

    const newInstallationFormControl = formCreated.get(
      '_module_make_new_installation'
    ) as FormControl;

    const frameNewIdFormControl = formCreated.get(
      '_module_frame_new_id'
    ) as FormControl;

    const frameNewPriceFormControl = formCreated.get(
      '_module_frame_new_price'
    ) as FormControl;

    const frameNewIvaPercentFormControl = formCreated.get(
      '_module_frame_new_iva_percent'
    ) as FormControl;

    const frameInstallationPriceFormControl = formCreated.get(
      '_module_frame_installation_price'
    ) as FormControl;

    const frameInstallationIvaPercentFormControl = formCreated.get(
      '_module_frame_installation_iva_percent'
    ) as FormControl;

    const modulePhotosGalleryFormControl = formCreated.get(
      '_module_photos_gallery'
    ) as FormControl;

    const mechanismsFormGroupsArray = formCreated.get(
      '_mechanisms'
    ) as FormArray;

    // wall identifier and reference point events

    if (
      !(wallIdentifierFormControl as any).$$__hasValueChangesEventSubscription
    ) {
      (wallIdentifierFormControl as any).$$__hasValueChangesEventSubscription =
        true;

      this.addSubscription(
        wallIdentifierFormControl.valueChanges
          .pipe(debounceTime(200), distinctUntilChanged())
          .subscribe(() => {
            const value = wallIdentifierFormControl.value;

            const referencePointModel = this.formModel.find(
              (model) => model.id === '_module_reference_point'
            ) as DynamicSelectModel<any>;

            if (referencePointModel) {
              const [p1, p2] = (value + ' - ').split(' - ');
              const options = [
                {
                  label: p1,
                  value: p1,
                },
                {
                  label: p2,
                  value: p2,
                },
              ];
              referencePointModel.options = [...options];
              referencePointModel.options$ = of([...options] as any[]);

              if (
                referencePointFormControl.value !== p1 &&
                referencePointFormControl.value !== p2
              ) {
                referencePointFormControl.setValue(p1);
              }

              setTimeout(() => {
                this.formService.detectChanges();
              }, 100);
            }
          })
      );
    }

    wallIdentifierFormControl.setValue(wallIdentifierFormControl.value);

    // new installation & keep existing installation events

    if (
      !(newInstallationFormControl as any).$$__hasValueChangesEventSubscription
    ) {
      (newInstallationFormControl as any).$$__hasValueChangesEventSubscription =
        true;

      this.addSubscription(
        newInstallationFormControl.valueChanges
          .pipe(debounceTime(200), distinctUntilChanged())
          .subscribe(() => {
            const value = newInstallationFormControl.value;
            if (value === !!keepExistingInstallationFormControl.value) {
              keepExistingInstallationFormControl.setValue(!value);
            }

            if (value && this.editable) {
              newInstallationFormControl.disable();
              keepExistingInstallationFormControl.enable();
            }

            if (!value) {
              frameNewIdFormControl.setValue(null);
              frameNewPriceFormControl.setValue('0.00');
              frameNewIvaPercentFormControl.setValue('0.00');
              frameInstallationPriceFormControl.setValue('0.00');
              frameInstallationIvaPercentFormControl.setValue('0.00');
            }

            mechanismsFormGroupsArray.controls.forEach(
              (mechanismFormGroup, index: number) => {
                const mechanismShowPriceControl = (
                  mechanismFormGroup as FormGroup
                ).get('module_mechanism_show_price');

                mechanismShowPriceControl?.setValue(value, {
                  emitEvent: true,
                });

                if (!value) {
                  (mechanismFormGroup as FormGroup)
                    .get('module_mechanism_new_price')
                    ?.setValue('0.00');
                  (mechanismFormGroup as FormGroup)
                    .get('module_mechanism_new_iva_percent')
                    ?.setValue('0.00');
                  (mechanismFormGroup as FormGroup)
                    .get('module_mechanism_installation_price')
                    ?.setValue('0.00');
                  (mechanismFormGroup as FormGroup)
                    .get('module_mechanism_installation_iva_percent')
                    ?.setValue('0.00');
                } else if (
                  value &&
                  this.editable &&
                  newInstallationFormControl.dirty &&
                  (mechanismFormGroup as FormGroup).get(
                    'module_mechanism_new_id'
                  )?.value !== null &&
                  (mechanismFormGroup as FormGroup).get(
                    'module_mechanism_new_id'
                  )?.value !== undefined &&
                  (mechanismFormGroup as FormGroup).get(
                    'module_mechanism_new_id'
                  )?.value !== ''
                ) {
                  const mechanismNewIdControlValue = (
                    mechanismFormGroup as FormGroup
                  ).get('module_mechanism_new_id')?.value;

                  (mechanismFormGroup as FormGroup)
                    .get('module_mechanism_new_id')
                    ?.setValue('---');

                  setTimeout(() => {
                    (mechanismFormGroup as FormGroup)
                      .get('module_mechanism_new_id')
                      ?.markAsDirty();

                    (mechanismFormGroup as FormGroup)
                      .get('module_mechanism_new_id')
                      ?.setValue(mechanismNewIdControlValue);
                  }, 201);
                }
              }
            );
          })
      );
    }

    if (
      !(keepExistingInstallationFormControl as any)
        .$$__hasValueChangesEventSubscription
    ) {
      (
        keepExistingInstallationFormControl as any
      ).$$__hasValueChangesEventSubscription = true;

      this.addSubscription(
        keepExistingInstallationFormControl.valueChanges
          .pipe(debounceTime(200), distinctUntilChanged())
          .subscribe(() => {
            const value = keepExistingInstallationFormControl.value;
            if (value === !!newInstallationFormControl.value) {
              newInstallationFormControl.setValue(!value);
            }

            if (value && this.editable) {
              keepExistingInstallationFormControl.disable();
              newInstallationFormControl.enable();
            }
          })
      );
    }

    keepExistingInstallationFormControl.setValue(
      keepExistingInstallationFormControl.value !== true &&
        newInstallationFormControl.value !== true
        ? true
        : keepExistingInstallationFormControl.value
    );

    // frame product id and price events

    if (!(frameNewIdFormControl as any).$$__hasValueChangesEventSubscription) {
      (frameNewIdFormControl as any).$$__hasValueChangesEventSubscription =
        true;

      this.addSubscription(
        frameNewIdFormControl.valueChanges
          .pipe(debounceTime(200), distinctUntilChanged())
          .subscribe(() => {
            if (!this.editable || !frameNewIdFormControl.dirty) {
              return;
            }
            const value = frameNewIdFormControl.value;

            const options =
              this.optionsLists[
                'products_electrical_mechanisms__frames$'
              ].getValue();

            const find = options.find((item) => item.value === value);

            const price = Number.parseFloat(find?.item?.price);
            frameNewPriceFormControl.setValue(
              Number.isNaN(price) ? '0.00' : price.toFixed(2)
            );

            const price_iva_percent = Number.parseFloat(
              find?.item?.iva_percent
            );
            frameNewIvaPercentFormControl.setValue(
              Number.isNaN(price_iva_percent)
                ? '0.00'
                : price_iva_percent.toFixed(2)
            );

            const labour_price = Number.parseFloat(find?.item?.labour_price);
            frameInstallationPriceFormControl.setValue(
              Number.isNaN(labour_price) ? '0.00' : labour_price.toFixed(2)
            );

            const labour_iva_percent = Number.parseFloat(
              find?.item?.labour_iva_percent
            );
            frameInstallationIvaPercentFormControl.setValue(
              Number.isNaN(labour_iva_percent)
                ? '0.00'
                : labour_iva_percent.toFixed(2)
            );

            const installation_price = Number.parseFloat(
              find?.item?.installation_price
            );
            frameInstallationPriceFormControl.setValue(
              Number.isNaN(installation_price)
                ? '0.00'
                : installation_price.toFixed(2)
            );
            const installation_iva_percent = Number.parseFloat(
              find?.item?.installation_iva_percent
            );
            frameInstallationIvaPercentFormControl.setValue(
              Number.isNaN(installation_iva_percent)
                ? '0.00'
                : installation_iva_percent.toFixed(2)
            );
          })
      );
    }

    // mechanisms events

    this.addSubscription(
      mechanismsFormGroupsArray.valueChanges
        .pipe(debounceTime(200), distinctUntilChanged())
        .subscribe(() => {
          const mechanismsArrayModel = this._internalFormModel.find(
            (item) => item.id === '_mechanisms'
          ) as DynamicFormArrayModel;

          const mechanismsArrayGroupModels = mechanismsArrayModel
            ? mechanismsArrayModel.groups
            : [];

          // console.log(mechanismsArrayGroupModels);

          mechanismsFormGroupsArray.controls.forEach(
            (mechanismFormGroup, index: number) => {
              const mechanismGroupModel =
                mechanismsArrayGroupModels[index].group;

              const showPriceControl = (mechanismFormGroup as FormGroup).get(
                'module_mechanism_show_price'
              );

              if (showPriceControl) {
                const value = newInstallationFormControl.value;
                if (showPriceControl.value !== value)
                  showPriceControl.setValue(value);
              }

              const mechanismCategoryIdFormControl = (
                mechanismFormGroup as FormGroup
              ).get('module_mechanism_category_id');

              const mechanismCategoryIdModel = mechanismGroupModel.find(
                (item) => item.id === 'module_mechanism_category_id'
              );

              const mechanismNewIdFormControl = (
                mechanismFormGroup as FormGroup
              ).get('module_mechanism_new_id') as FormControl;

              const mechanismNewIdModel = mechanismGroupModel.find(
                (item) => item.id === 'module_mechanism_new_id'
              );

              const mechanismNewPriceFormControl = (
                mechanismFormGroup as FormGroup
              ).get('module_mechanism_new_price') as FormControl;

              const mechanismNewIvaPercentFormControl = (
                mechanismFormGroup as FormGroup
              ).get('module_mechanism_new_iva_percent') as FormControl;

              const mechanismInstallationPriceFormControl = (
                mechanismFormGroup as FormGroup
              ).get('module_mechanism_installation_price') as FormControl;

              const mechanismInstallationIvaPercentFormControl = (
                mechanismFormGroup as FormGroup
              ).get('module_mechanism_installation_iva_percent') as FormControl;
              (mechanismCategoryIdFormControl as any).$$__index = index;
              (mechanismNewIdFormControl as any).$$__index = index;

              if (
                !(mechanismNewIdFormControl as any)
                  .$$__hasValueChangesEventSubscription
              ) {
                (
                  mechanismNewIdFormControl as any
                ).$$__hasValueChangesEventSubscription = true;

                const uuid = this.uuidService.uuid();

                (mechanismNewIdFormControl as any).$$__uuid = uuid;
                (mechanismCategoryIdFormControl as any).$$__uuid = uuid;

                this.addSubscription(
                  mechanismNewIdFormControl?.valueChanges
                    .pipe(debounceTime(200), distinctUntilChanged())
                    .subscribe(() => {
                      if (!this.editable || !mechanismNewIdFormControl.dirty) {
                        return;
                      }

                      const value = mechanismNewIdFormControl.value;

                      const options = this.optionsForMechanismsIds[
                        (mechanismCategoryIdFormControl as any).$$__uuid
                      ].options as any[];

                      const find = options.find((item) => item.value === value);

                      const price = Number.parseFloat(find?.item?.price);
                      mechanismNewPriceFormControl.setValue(
                        Number.isNaN(price) ? '0.00' : price.toFixed(2)
                      );
                      const price_iva_percent = Number.parseFloat(
                        find?.item?.iva_percent
                      );
                      mechanismNewIvaPercentFormControl.setValue(
                        Number.isNaN(price_iva_percent)
                          ? '0.00'
                          : price_iva_percent.toFixed(2)
                      );

                      const installation_price = Number.parseFloat(
                        find?.item?.installation_price
                      );
                      mechanismInstallationPriceFormControl.setValue(
                        Number.isNaN(installation_price)
                          ? '0.00'
                          : installation_price.toFixed(2)
                      );
                      const installation_iva_percent = Number.parseFloat(
                        find?.item?.installation_iva_percent
                      );
                      mechanismInstallationIvaPercentFormControl.setValue(
                        Number.isNaN(installation_iva_percent)
                          ? '0.00'
                          : installation_iva_percent.toFixed(2)
                      );

                      // reset prices values if showPriceControl not true

                      if (showPriceControl?.value !== true) {
                        mechanismNewPriceFormControl.setValue('0.00');
                        mechanismNewIvaPercentFormControl.setValue('0.00');
                        mechanismInstallationPriceFormControl.setValue('0.00');
                        mechanismInstallationIvaPercentFormControl.setValue(
                          '0.00'
                        );
                      }
                    })
                );
              }

              if (
                !(mechanismCategoryIdFormControl as any)
                  .$$__hasValueChangesEventSubscription
              ) {
                (
                  mechanismCategoryIdFormControl as any
                ).$$__hasValueChangesEventSubscription = true;

                this.addSubscription(
                  mechanismCategoryIdFormControl?.valueChanges
                    .pipe(debounceTime(200), distinctUntilChanged())
                    .subscribe(() => {
                      const value: string | null =
                        mechanismCategoryIdFormControl?.value;

                      const optionsKeyByCategoryId =
                        'products_electrical_mechanisms_by_category_id' +
                        '__' +
                        (value && value !== '' ? value : '---');

                      const optionsKeys = [optionsKeyByCategoryId];

                      this.startLoader('Add-Edit-Project-ELECTRICAL-MECHANISM');

                      this.optionsListsService
                        .getOptionsLists(optionsKeys, {
                          orderByLabelAlphabetical: true,
                        })
                        .results?.forEach((optionsResult: any) => {
                          this.addSubscription(
                            optionsResult.options$
                              .pipe(take(1))
                              .subscribe((options: any[]) => {
                                this.endLoader(
                                  'Add-Edit-Project-ELECTRICAL-MECHANISM'
                                );
                                if (
                                  optionsResult.fullKey ===
                                  optionsKeyByCategoryId
                                ) {
                                  const optionsByCategoryId = [
                                    { label: '', value: '', item: {} },
                                    ...options,
                                  ];
                                  (
                                    mechanismNewIdModel as DynamicSelectModel<string>
                                  ).options = options;
                                  (
                                    mechanismNewIdModel as DynamicSelectModel<string>
                                  ).options$ = of(optionsByCategoryId as any[]);

                                  this.optionsForMechanismsIds[
                                    (
                                      mechanismCategoryIdFormControl as any
                                    ).$$__uuid
                                  ] = {
                                    options: optionsByCategoryId as any[],
                                    options$: of(optionsByCategoryId),
                                    control: mechanismNewIdFormControl,
                                    model:
                                      mechanismNewIdModel as DynamicFormControlModel,
                                  };

                                  setTimeout(() => {
                                    this.formService.detectChanges();
                                  }, 100);
                                }
                              })
                          );
                        });

                      // ----------------------------------

                      if (
                        this.editable &&
                        mechanismCategoryIdFormControl.dirty
                      ) {
                        mechanismNewIdFormControl?.setValue(null);
                        mechanismNewPriceFormControl?.setValue('0.00');
                        mechanismNewIvaPercentFormControl?.setValue('0.00');
                        mechanismInstallationPriceFormControl?.setValue('0.00');
                        mechanismInstallationIvaPercentFormControl?.setValue(
                          '0.00'
                        );
                      }
                    })
                );

                mechanismCategoryIdFormControl?.setValue(
                  mechanismCategoryIdFormControl.value
                );
              }

              this.optionsForMechanismsIdsUUIDs[index] = (
                mechanismCategoryIdFormControl as any
              ).$$__uuid;
            }
          );

          setTimeout(() => {
            this.formService.detectChanges();
          }, 100);
        })
    );

    this.formGroup = event as FormGroup;

    this.formGroupCreated.emit(event as FormGroup);
  }

  protected override onFormModelUpdated(event: any): void {
    this._internalFormModel = event as DynamicFormModel;
    super.onFormModelUpdated(event as DynamicFormModel);
  }

  // -------------------------------------------------------------------------
}
