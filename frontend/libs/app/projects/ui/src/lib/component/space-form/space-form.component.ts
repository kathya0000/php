/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChangeDetectionStrategy,
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  inject
} from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import {
  AND_OPERATOR,
  DynamicCheckboxModel,
  DynamicFormArrayModel,
  DynamicFormLayout,
  DynamicFormModel,
  DynamicInputModel,
  DynamicSelectModel,
  MATCH_DISABLED,
  MATCH_REQUIRED,
  MATCH_VISIBLE,
  OR_OPERATOR
} from '@ng-dynamic-forms/core';

import { marker as _i18n } from '@biesbjerg/ngx-translate-extract-marker';

import { AppFileUploaderService } from '@apps/app-base-domain';
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  take,
} from 'rxjs';
import { AbstractUiFormComponent } from '../abstract-form.component';

@Component({
  selector: 'app-projects-ui-space-form',
  templateUrl: './space-form.component.html',
  styleUrls: ['./space-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpaceFormComponent
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
      'spaces_types__all',
      // ----------------------------------------------
      'products_types__all',
      'products_categories__frames',
      'products_categories__electrical_mechanisms',
      // ----------------------------------------------
      'products_doors__all',
      'products_windows__all',
      'products_blinds__all',
      'products_electrical_mechanisms__frames',
      // ----------------------------------------------

      'labours__doors',
      'labours__blinds',
      'labours__windows',
      'labours__frames',
      'labours__electrical_mechanisms',
      // ----------------------------------------------
    ];
  }

  protected override getDefaultOptionsLists(): {
    [id: string]: BehaviorSubject<any[]>;
  } {
    return {
      // add custom observables options
      walls_identifiers$: new BehaviorSubject<any[]>([]),
      doors_opening_directions$: new BehaviorSubject<any[]>([]),
      modules_trenches_directions$: new BehaviorSubject<any[]>([]),
    };
  }

  // -------------------------------------------------------------------------

  private fileUploader: AppFileUploaderService = inject<AppFileUploaderService>(
    AppFileUploaderService
  );

  protected imageStoreBasePath = this.fileUploader.getImageStoreBasePath();

  // -------------------------------------------------------------------------

  protected getFormModel(editable = true): DynamicFormModel {
    return [
      // -----------------------------------------------

      // Space type

      new DynamicSelectModel<string>({
        id: 'space_type_id',
        value: this.initialData?.space_type_id,
        required: true,
        label: _i18n('app.projects.ui.form.spaces.space_type'),
        disabled: !editable,
        options: this.optionsLists['spaces_types__all$'].asObservable(),
        additional: {
          translate_label: true,
        },
      }),

      // Space Id

      new DynamicInputModel({
        id: 'id',
        value: this.initialData?.id,
        required: false,
        inputType: 'hidden',
        readOnly: !editable,
        disabled: !editable,
      }),

      // Space Floor Area

      new DynamicInputModel({
        id: 'space_floor_area',
        value: this.initialData?.space_floor_area,
        required: false,
        inputType: 'hidden',
        readOnly: !editable,
        disabled: !editable,
      }),

      // Space Ceiling Area

      new DynamicInputModel({
        id: 'space_ceiling_area',
        value: this.initialData?.space_ceiling_area,
        required: false,
        inputType: 'hidden',
        readOnly: !editable,
        disabled: !editable,
      }),

      // Hr

      new DynamicInputModel({
        id: '$$__hr',
        value: '',
        required: false,
        inputType: 'hidden',
      }),

      // -----------------------------------------------

      // Walls

      new DynamicFormArrayModel(
        {
          id: 'walls',
          label: this.translatePipe.transform(
            _i18n('app.projects.ui.form.spaces.walls.header')
          ),
          initialCount:
            this.initialData?.walls && this.initialData?.walls?.length > 0
              ? this.initialData?.walls?.length
              : 4,
          groupFactory: () => {
            return [
              // Wall Area

              new DynamicInputModel({
                id: 'wall_area',
                value: 0,
                required: false,
                inputType: 'hidden',
                readOnly: !editable,
                disabled: !editable,
              }),

              // Identifier

              new DynamicInputModel({
                id: 'wall_identifier',
                label: _i18n('app.projects.ui.form.spaces.walls.identifier'),
                required: true,
                readOnly: true,
                disabled: true,
                additional: {
                  translate_label: true,
                },
              }),

              // Width

              new DynamicInputModel({
                id: 'wall_width',
                inputType: 'number',
                value: 3000,
                required: true,
                label: _i18n('app.projects.ui.form.spaces.walls.width'),
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

              // Height

              new DynamicInputModel({
                id: 'wall_height',
                inputType: 'number',
                value: 2500,
                required: true,
                label: _i18n('app.projects.ui.form.spaces.walls.height'),
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

              // Angle

              new DynamicInputModel({
                id: 'wall_angle',
                inputType: 'number',
                value: 90,
                required: true,
                label: _i18n('app.projects.ui.form.spaces.walls.angle'),
                readOnly: !editable,
                disabled: !editable,
                validators: {
                  required: null,
                  min: 0,
                  max: 360,
                },
                additional: {
                  translate_label: true,
                },
              }),
            ];
          },
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

      // -----------------------------------------------

      // Doors

      new DynamicFormArrayModel(
        {
          id: 'doors',
          label: this.translatePipe.transform(
            _i18n('app.projects.ui.form.spaces.doors.header')
          ),
          initialCount:
            this.initialData?.doors && this.initialData?.doors?.length > 0
              ? this.initialData?.doors?.length
              : 1,
          groupFactory: () => {
            return [
              // Door Area

              new DynamicInputModel({
                id: 'door_area',
                value: 0,
                required: false,
                inputType: 'hidden',
                readOnly: !editable,
                disabled: !editable,
              }),

              // Wall identifier

              new DynamicSelectModel<string>({
                id: 'door_wall_identifier',
                value: 'A - B',
                required: true,
                label: _i18n('app.projects.ui.form.spaces.doors.wall'),
                disabled: !editable,
                options: this.optionsLists['walls_identifiers$'].asObservable(),
                additional: {
                  translate_label: true,
                },
              }),

              // Opening IN OUT LEFT RIGHT

              new DynamicSelectModel<string>({
                id: 'door_opening_direction',
                value: 'NONE_NONE',
                required: false,
                label: _i18n(
                  'app.projects.ui.form.spaces.doors.opening_direction'
                ),
                disabled: !editable,
                options:
                  this.optionsLists['doors_opening_directions$'].asObservable(),
                additional: {
                  translate_label: true,
                },
              }),

              // Width

              new DynamicInputModel({
                id: 'door_width',
                inputType: 'number',
                value: 1000,
                required: true,
                label: _i18n('app.projects.ui.form.spaces.doors.width'),
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

              // Height

              new DynamicInputModel({
                id: 'door_height',
                inputType: 'number',
                value: 2000,
                required: true,
                label: _i18n('app.projects.ui.form.spaces.doors.height'),
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

              // Wall depth

              new DynamicInputModel({
                id: 'door_wall_depth',
                inputType: 'number',
                value: 200,
                required: true,
                label: _i18n('app.projects.ui.form.spaces.doors.wall_depth'),
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

              // Left Width

              new DynamicInputModel({
                id: 'door_left_width',
                inputType: 'number',
                value: 1000,
                required: true,
                label: _i18n('app.projects.ui.form.spaces.doors.left_width'),
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

              // Must change

              new DynamicCheckboxModel({
                id: 'door_change',
                value: false,
                label: _i18n('app.projects.ui.form.spaces.doors.door_change'),
                disabled: !editable,
                additional: {
                  translate_label: true,
                },
              }),

              // Door New Id

              new DynamicSelectModel<string>({
                id: 'door_new_id',
                value: '',
                required: true,
                label: _i18n('app.projects.ui.form.spaces.doors.door_new_id'),
                disabled: !editable,
                options:
                  this.optionsLists['products_doors__all$'].asObservable(),
                additional: {
                  translate_label: true,
                  use_ng_select: true,
                  use_ng_select__clearable: false,
                },
                relations: [
                  {
                    match: MATCH_VISIBLE,
                    operator: AND_OPERATOR,
                    when: [{ id: 'door_change', value: true }],
                  },
                  {
                    match: MATCH_REQUIRED,
                    operator: AND_OPERATOR,
                    when: [{ id: 'door_change', value: true }],
                  },
                ],
              }),

              // Price

              new DynamicInputModel({
                id: 'door_new_price',
                value: '0.00',
                required: true,
                label: _i18n(
                  'app.projects.ui.form.spaces.doors.door_new_price'
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
                    match: MATCH_VISIBLE,
                    operator: AND_OPERATOR,
                    when: [{ id: 'door_change', value: true }],
                  },
                  {
                    match: MATCH_REQUIRED,
                    operator: AND_OPERATOR,
                    when: [{ id: 'door_change', value: true }],
                  },
                ],
              }),

              new DynamicInputModel({
                id: 'door_new_iva_percent',
                value: '0.00',
                required: false,
                inputType: 'hidden',
                readOnly: !editable,
                disabled: !editable,
              }),

              // Labour Id

              new DynamicSelectModel<string>({
                id: 'door_labour_id',
                value: '',
                required: true,
                label: _i18n(
                  'app.projects.ui.form.spaces.doors.door_labour_id'
                ),
                disabled: !editable,
                options: this.optionsLists['labours__doors$'].asObservable(),
                additional: {
                  translate_label: true,
                },
                relations: [
                  {
                    match: MATCH_VISIBLE,
                    operator: AND_OPERATOR,
                    when: [{ id: 'door_change', value: true }],
                  },
                  {
                    match: MATCH_REQUIRED,
                    operator: AND_OPERATOR,
                    when: [{ id: 'door_change', value: true }],
                  },
                ],
              }),

              // Labour Price

              new DynamicInputModel({
                id: 'door_labour_price',
                value: '0.00',
                required: true,
                label: _i18n(
                  'app.projects.ui.form.spaces.doors.door_labour_price'
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
                    match: MATCH_VISIBLE,
                    operator: AND_OPERATOR,
                    when: [{ id: 'door_change', value: true }],
                  },
                  {
                    match: MATCH_REQUIRED,
                    operator: AND_OPERATOR,
                    when: [{ id: 'door_change', value: true }],
                  },
                ],
              }),

              new DynamicInputModel({
                id: 'door_labour_iva_percent',
                value: '0.00',
                required: false,
                inputType: 'hidden',
                readOnly: !editable,
                disabled: !editable,
              }),

              // Photo Gallery

              new DynamicInputModel({
                id: 'door_photos_gallery',
                value: [],
                inputType: 'hidden',
                readOnly: !editable,
                disabled: !editable,
                relations: [
                  {
                    match: MATCH_VISIBLE,
                    operator: AND_OPERATOR,
                    when: [{ id: 'door_change', value: true }],
                  },
                ],
              }),

              // END
            ];
          },
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

      // -----------------------------------------------

      // Has Windows

      new DynamicCheckboxModel({
        id: 'window_has_window',
        value: false,
        label: _i18n('app.projects.ui.form.spaces.windows.window_has_window'),
        disabled: !editable,
        additional: {
          translate_label: true,
        },
      }),

      // Hr

      new DynamicInputModel({
        id: '$$__hr',
        value: '',
        inputType: 'hidden',
        readOnly: !editable,
        disabled: !editable,
        relations: [
          {
            match: MATCH_VISIBLE,
            operator: AND_OPERATOR,
            when: [{ id: 'window_has_window', value: true }],
          },
        ],
      }),

      // Windows

      new DynamicFormArrayModel(
        {
          id: 'windows',
          label: this.translatePipe.transform(
            _i18n('app.projects.ui.form.spaces.windows.header')
          ),
          initialCount:
            this.initialData?.windows && this.initialData?.windows?.length > 0
              ? this.initialData?.windows?.length
              : 1,
          relations: [
            {
              match: MATCH_VISIBLE,
              operator: AND_OPERATOR,
              when: [{ id: 'window_has_window', value: true }],
            },
            {
              match: MATCH_DISABLED,
              operator: AND_OPERATOR,
              when: [{ id: 'window_has_window', value: false }],
            },
          ],
          groupFactory: () => {
            return [
              // Window Area

              new DynamicInputModel({
                id: 'window_area',
                value: 0,
                required: false,
                inputType: 'hidden',
                readOnly: !editable,
                disabled: !editable,
              }),

              // Wall identifier

              new DynamicSelectModel<string>({
                id: 'window_wall_identifier',
                value: 'B - C',
                required: true,
                label: _i18n('app.projects.ui.form.spaces.windows.wall'),
                disabled: !editable,
                options: this.optionsLists['walls_identifiers$'].asObservable(),
                additional: {
                  translate_label: true,
                },
              }),

              // Width

              new DynamicInputModel({
                id: 'window_width',
                inputType: 'number',
                value: 1000,
                required: true,
                label: _i18n('app.projects.ui.form.spaces.windows.width'),
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

              // Height

              new DynamicInputModel({
                id: 'window_height',
                inputType: 'number',
                value: 1000,
                required: true,
                label: _i18n('app.projects.ui.form.spaces.windows.height'),
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

              // Wall depth

              new DynamicInputModel({
                id: 'window_wall_depth',
                inputType: 'number',
                value: 200,
                required: true,
                label: _i18n('app.projects.ui.form.spaces.windows.wall_depth'),
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

              // Left Width

              new DynamicInputModel({
                id: 'window_left_width',
                inputType: 'number',
                value: 1000,
                required: true,
                label: _i18n('app.projects.ui.form.spaces.windows.left_width'),
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

              // Under height

              new DynamicInputModel({
                id: 'window_under_height',
                inputType: 'number',
                value: 1000,
                required: true,
                label: _i18n(
                  'app.projects.ui.form.spaces.windows.under_height'
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

              // Window Must change

              new DynamicCheckboxModel({
                id: 'window_change',
                value: false,
                label: _i18n(
                  'app.projects.ui.form.spaces.windows.window_change'
                ),
                disabled: !editable,
                additional: {
                  translate_label: true,
                },
              }),

              // Has Blind

              new DynamicCheckboxModel({
                id: 'window_blind_has_blind',
                value: false,
                label: _i18n('app.projects.ui.form.spaces.windows.has_blind'),
                disabled: !editable,
                additional: {
                  translate_label: true,
                },
              }),

              // Has Motorized blind

              new DynamicCheckboxModel({
                id: 'window_blind_is_motorized',
                value: false,
                label: _i18n(
                  'app.projects.ui.form.spaces.windows.has_motorized_blind'
                ),
                disabled: !editable,
                additional: {
                  translate_label: true,
                },
                relations: [
                  {
                    match: MATCH_VISIBLE,
                    operator: AND_OPERATOR,
                    when: [{ id: 'window_blind_has_blind', value: true }],
                  },
                ],
              }),

              // Blind Must change

              new DynamicCheckboxModel({
                id: 'window_blind_change',
                value: false,
                label: _i18n(
                  'app.projects.ui.form.spaces.windows.blind_change'
                ),
                disabled: !editable,
                additional: {
                  translate_label: true,
                },
                relations: [
                  {
                    match: MATCH_VISIBLE,
                    operator: AND_OPERATOR,
                    when: [{ id: 'window_blind_has_blind', value: true }],
                  },
                ],
              }),

              // Window New Id

              new DynamicSelectModel<string>({
                id: 'window_new_id',
                value: '',
                required: true,
                label: _i18n(
                  'app.projects.ui.form.spaces.windows.window_new_id'
                ),
                disabled: !editable,
                options:
                  this.optionsLists['products_windows__all$'].asObservable(),
                additional: {
                  translate_label: true,
                  use_ng_select: true,
                  use_ng_select__clearable: false,
                },
                relations: [
                  {
                    match: MATCH_VISIBLE,
                    operator: AND_OPERATOR,
                    when: [{ id: 'window_change', value: true }],
                  },
                  {
                    match: MATCH_REQUIRED,
                    operator: AND_OPERATOR,
                    when: [{ id: 'window_change', value: true }],
                  },
                ],
              }),

              // Window Price

              new DynamicInputModel({
                id: 'window_new_price',
                value: '0.00',
                required: true,
                label: _i18n(
                  'app.projects.ui.form.spaces.windows.window_new_price'
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
                    match: MATCH_VISIBLE,
                    operator: AND_OPERATOR,
                    when: [{ id: 'window_change', value: true }],
                  },
                  {
                    match: MATCH_REQUIRED,
                    operator: AND_OPERATOR,
                    when: [{ id: 'window_change', value: true }],
                  },
                ],
              }),

              new DynamicInputModel({
                id: 'window_new_iva_percent',
                value: '0.00',
                required: false,
                inputType: 'hidden',
                readOnly: !editable,
                disabled: !editable,
              }),

              // Window Labour Id

              new DynamicSelectModel<string>({
                id: 'window_labour_id',
                value: '',
                required: true,
                label: _i18n(
                  'app.projects.ui.form.spaces.windows.window_labour_id'
                ),
                disabled: !editable,
                options: this.optionsLists['labours__windows$'].asObservable(),
                additional: {
                  translate_label: true,
                },
                relations: [
                  {
                    match: MATCH_VISIBLE,
                    operator: AND_OPERATOR,
                    when: [{ id: 'window_change', value: true }],
                  },
                  {
                    match: MATCH_REQUIRED,
                    operator: AND_OPERATOR,
                    when: [{ id: 'window_change', value: true }],
                  },
                ],
              }),

              // Window Labour Price

              new DynamicInputModel({
                id: 'window_labour_price',
                value: '0.00',
                required: true,
                label: _i18n(
                  'app.projects.ui.form.spaces.windows.window_labour_price'
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
                    match: MATCH_VISIBLE,
                    operator: AND_OPERATOR,
                    when: [{ id: 'window_change', value: true }],
                  },
                  {
                    match: MATCH_REQUIRED,
                    operator: AND_OPERATOR,
                    when: [{ id: 'window_change', value: true }],
                  },
                ],
              }),

              new DynamicInputModel({
                id: 'window_labour_iva_percent',
                value: '0.00',
                required: false,
                inputType: 'hidden',
                readOnly: !editable,
                disabled: !editable,
              }),

              // New Blind Type Id

              new DynamicSelectModel<string>({
                id: 'window_blind_new_id',
                value: '',
                required: true,
                label: _i18n(
                  'app.projects.ui.form.spaces.windows.blind_new_id'
                ),
                disabled: !editable,
                options:
                  this.optionsLists['products_blinds__all$'].asObservable(),
                additional: {
                  translate_label: true,
                  use_ng_select: true,
                  use_ng_select__clearable: false,
                },
                relations: [
                  {
                    match: MATCH_VISIBLE,
                    operator: AND_OPERATOR,
                    when: [{ id: 'window_blind_change', value: true }],
                  },
                  {
                    match: MATCH_REQUIRED,
                    operator: AND_OPERATOR,
                    when: [{ id: 'window_blind_change', value: true }],
                  },
                ],
              }),

              // Blind Price

              new DynamicInputModel({
                id: 'window_blind_new_price',
                value: '0.00',
                required: true,
                label: _i18n(
                  'app.projects.ui.form.spaces.windows.blind_new_price'
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
                    match: MATCH_VISIBLE,
                    operator: AND_OPERATOR,
                    when: [{ id: 'window_blind_change', value: true }],
                  },
                  {
                    match: MATCH_REQUIRED,
                    operator: AND_OPERATOR,
                    when: [{ id: 'window_blind_change', value: true }],
                  },
                ],
              }),

              new DynamicInputModel({
                id: 'window_blind_new_iva_percent',
                value: '0.00',
                required: false,
                inputType: 'hidden',
                readOnly: !editable,
                disabled: !editable,
              }),

              // Blind Labour Id

              new DynamicSelectModel<string>({
                id: 'window_blind_labour_id',
                value: '',
                required: true,
                label: _i18n(
                  'app.projects.ui.form.spaces.windows.blind_labour_id'
                ),
                disabled: !editable,
                options: this.optionsLists['labours__blinds$'].asObservable(),
                additional: {
                  translate_label: true,
                },
                relations: [
                  {
                    match: MATCH_VISIBLE,
                    operator: AND_OPERATOR,
                    when: [{ id: 'window_blind_change', value: true }],
                  },
                  {
                    match: MATCH_REQUIRED,
                    operator: AND_OPERATOR,
                    when: [{ id: 'window_blind_change', value: true }],
                  },
                ],
              }),

              // Blind Labour Price

              new DynamicInputModel({
                id: 'window_blind_labour_price',
                value: '0.00',
                required: true,
                label: _i18n(
                  'app.projects.ui.form.spaces.windows.blind_labour_price'
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
                    match: MATCH_VISIBLE,
                    operator: AND_OPERATOR,
                    when: [{ id: 'window_blind_change', value: true }],
                  },
                  {
                    match: MATCH_REQUIRED,
                    operator: AND_OPERATOR,
                    when: [{ id: 'window_blind_change', value: true }],
                  },
                ],
              }),

              new DynamicInputModel({
                id: 'window_blind_labour_iva_percent',
                value: '0.00',
                required: false,
                inputType: 'hidden',
                readOnly: !editable,
                disabled: !editable,
              }),

              // Photo Gallery

              new DynamicInputModel({
                id: 'window_photos_gallery',
                value: [],
                inputType: 'hidden',
                readOnly: !editable,
                disabled: !editable,
                relations: [
                  {
                    match: MATCH_VISIBLE,
                    operator: OR_OPERATOR,
                    when: [
                      { id: 'window_change', value: true },
                      { id: 'window_blind_change', value: true },
                    ],
                  },
                ],
              }),

              // END
            ];
          },
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

      // -----------------------------------------------

      // Modules

      new DynamicFormArrayModel(
        {
          id: 'modules',
          label: this.translatePipe.transform(
            _i18n('app.projects.ui.form.spaces.modules.header')
          ),
          initialCount:
            this.initialData?.modules && this.initialData?.modules?.length > 0
              ? this.initialData?.modules?.length
              : 1,
          relations: [
            /*{
              match: MATCH_VISIBLE,
              operator: AND_OPERATOR,
              when: [{ id: 'has_modules', value: true }],
            },*/
          ],
          groupFactory: () => {
            return [
              // Wall identifier

              new DynamicInputModel({
                id: 'module_wall_identifier',
                value: 'A - B',
                required: false,
                inputType: 'hidden',
                readOnly: !editable,
                disabled: !editable,
              }),

              // Keep Existing Installation

              new DynamicInputModel({
                id: 'module_keep_existing_installation',
                value: 1,
                required: false,
                inputType: 'hidden',
                readOnly: !editable,
                disabled: !editable,
              }),

              // New Installation

              new DynamicInputModel({
                id: 'module_make_new_installation',
                value: 0,
                required: false,
                inputType: 'hidden',
                readOnly: !editable,
                disabled: !editable,
              }),

              // Reference Point

              new DynamicInputModel({
                id: 'module_reference_point',
                value: 'A',
                required: false,
                inputType: 'hidden',
                readOnly: !editable,
                disabled: !editable,
                validators: {
                  required: null,
                  min: 0,
                },
              }),

              // Distance to Reference Point

              new DynamicInputModel({
                id: 'module_distance_to_reference_point',
                value: 500,
                required: false,
                inputType: 'hidden',
                readOnly: !editable,
                disabled: !editable,
                validators: {
                  required: null,
                  min: 0,
                },
              }),

              // Distance to Floor

              new DynamicInputModel({
                id: 'module_bottom_height',
                value: 500,
                required: false,
                inputType: 'hidden',
                readOnly: !editable,
                disabled: !editable,
                validators: {
                  required: null,
                  min: 0,
                },
              }),

              // Distance to Ceiling

              /*
              new DynamicInputModel({
                id: 'module_trenches_top_height',
                value: 1500,
                required: false,
                inputType: 'hidden',
                readOnly: !editable,
                disabled: !editable,
                validators: {
                  required: null,
                  min: 0,
                },
              }),
              */

              // Trenches Count

              new DynamicInputModel({
                id: 'module_trenches_count',
                value: 1,
                required: false,
                inputType: 'hidden',
                readOnly: !editable,
                disabled: !editable,
                validators: {
                  required: null,
                  min: 1,
                },
              }),

              // trenches Direction

              new DynamicInputModel({
                id: 'module_trenches_direction',
                value: '',
                required: false,
                inputType: 'hidden',
                readOnly: !editable,
                disabled: !editable,
              }),

              // Mechanisms

              new DynamicInputModel({
                id: 'mechanisms',
                value: [],
                required: false,
                inputType: 'hidden',
                readOnly: !editable,
                disabled: !editable,
              }),

              // New Frame Type Id

              new DynamicInputModel({
                id: 'module_frame_new_id',
                value: '',
                required: false,
                inputType: 'hidden',
                readOnly: !editable,
                disabled: !editable,
              }),

              // Frame Price

              new DynamicInputModel({
                id: 'module_frame_new_price',
                value: '0.00',
                required: false,
                inputType: 'hidden',
                readOnly: !editable,
                disabled: !editable,
                validators: {
                  required: null,
                  min: 0,
                },
              }),

              new DynamicInputModel({
                id: 'module_frame_new_iva_percent',
                value: '0.00',
                required: false,
                inputType: 'hidden',
                readOnly: !editable,
                disabled: !editable,
              }),

              // Frame Labour Price

              new DynamicInputModel({
                id: 'module_frame_installation_price',
                value: '0.00',
                required: false,
                inputType: 'hidden',
                readOnly: !editable,
                disabled: !editable,
                validators: {
                  required: null,
                  min: 0,
                },
              }),

              new DynamicInputModel({
                id: 'module_frame_installation_iva_percent',
                value: '0.00',
                required: false,
                inputType: 'hidden',
                readOnly: !editable,
                disabled: !editable,
              }),

              // END
            ];
          },
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
      space_floor_area: {
        element: {
          host: 'd-none',
        },
        grid: {
          host: 'd-none',
        },
      },
      space_ceiling_area: {
        element: {
          host: 'd-none',
        },
        grid: {
          host: 'd-none',
        },
      },
      space_type_id: {
        element: {
          host: 'col-xl-4 col-lg-4 col-md-4 col-sm-8 col-xs-12',
          label: editable ? 'input-required' : '',
        },
        grid: {
          host: 'col-xl-4 col-lg-4 col-md-4 col-sm-8 col-xs-12',
          label: editable ? 'input-required' : '',
        },
      },
      // ---------------------------------------------
      wall_area: {
        element: {
          host: 'd-none',
        },
        grid: {
          host: 'd-none',
        },
      },
      wall_identifier: {
        element: {
          host: 'col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-12',
          label: editable ? 'input-required' : '',
        },
        grid: {
          host: 'col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-12',
          label: editable ? 'input-required' : '',
        },
      },
      wall_width: {
        element: {
          host: 'col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-12',
          label: editable ? 'input-required' : '',
        },
        grid: {
          host: 'col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-12',
          label: editable ? 'input-required' : '',
        },
      },
      wall_height: {
        element: {
          host: 'col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-12',
          label: editable ? 'input-required' : '',
        },
        grid: {
          host: 'col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-12',
          label: editable ? 'input-required' : '',
        },
      },
      wall_angle: {
        element: {
          host: 'col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-12',
          label: editable ? 'input-required' : '',
        },
        grid: {
          host: 'col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-12',
          label: editable ? 'input-required' : '',
        },
      },
      // ---------------------------------------------
      door_area: {
        element: {
          host: 'd-none',
        },
        grid: {
          host: 'd-none',
        },
      },
      door_wall_identifier: {
        element: {
          host: 'col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-12',
          label: editable ? 'input-required' : '',
        },
        grid: {
          host: 'col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-12',
          label: editable ? 'input-required' : '',
        },
      },
      door_opening_direction: {
        element: {
          host: 'col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-12',
          label: editable ? 'input-required' : '',
        },
        grid: {
          host: 'col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-12',
          label: editable ? 'input-required' : '',
        },
      },
      door_width: {
        element: {
          host: 'col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-12',
          label: editable ? 'input-required' : '',
        },
        grid: {
          host: 'col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-12',
          label: editable ? 'input-required' : '',
        },
      },
      door_height: {
        element: {
          host: 'col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-12',
          label: editable ? 'input-required' : '',
        },
        grid: {
          host: 'col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-12',
          label: editable ? 'input-required' : '',
        },
      },
      door_left_width: {
        element: {
          host: 'col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-12',
          label: editable ? 'input-required' : '',
        },
        grid: {
          host: 'col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-12',
          label: editable ? 'input-required' : '',
        },
      },
      door_wall_depth: {
        element: {
          host: 'col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-12',
          label: editable ? 'input-required' : '',
        },
        grid: {
          host: 'col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-12',
          label: editable ? 'input-required' : '',
        },
      },
      door_change: {
        element: {
          host: 'col-xl-8 col-lg-8 col-md-8 col-sm-8 col-xs-12 pt-3 pb-1',
          label: '',
        },
        grid: {
          host: 'col-xl-8 col-lg-8 col-md-8 col-sm-8 col-xs-12 pt-3 pb-1',
          label: '',
        },
      },
      door_new_id: {
        element: {
          host: 'col-xl-8 col-lg-8 col-md-8 col-sm-8 col-xs-12',
          label: editable ? 'input-required' : '',
        },
        grid: {
          host: 'col-xl-8 col-lg-8 col-md-8 col-sm-8 col-xs-12',
          label: editable ? 'input-required' : '',
        },
      },
      door_new_price: {
        element: {
          host: 'col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-12',
          label: editable ? 'input-required' : '',
        },
        grid: {
          host: 'col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-12',
          label: editable ? 'input-required' : '',
        },
      },
      door_new_iva_percent: {
        element: {
          host: 'd-none',
        },
        grid: {
          host: 'd-none',
        },
      },
      door_labour_id: {
        element: {
          host: 'col-xl-8 col-lg-8 col-md-8 col-sm-8 col-xs-12',
          label: editable ? 'input-required' : '',
        },
        grid: {
          host: 'col-xl-8 col-lg-8 col-md-8 col-sm-8 col-xs-12',
          label: editable ? 'input-required' : '',
        },
      },
      door_labour_price: {
        element: {
          host: 'col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-12',
          label: editable ? 'input-required' : '',
        },
        grid: {
          host: 'col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-12',
          label: editable ? 'input-required' : '',
        },
      },
      door_labour_iva_percent: {
        element: {
          host: 'd-none',
        },
        grid: {
          host: 'd-none',
        },
      },
      // ---------------------------------------------
      window_has_window: {
        element: {
          host: 'col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 pt-1',
          label: '',
        },
        grid: {
          host: 'col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 pt-1',
          label: '',
        },
      },
      window_area: {
        element: {
          host: 'd-none',
        },
        grid: {
          host: 'd-none',
        },
      },
      window_wall_identifier: {
        element: {
          host: 'col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-12',
          label: editable ? 'input-required' : '',
        },
        grid: {
          host: 'col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-12',
          label: editable ? 'input-required' : '',
        },
      },
      window_width: {
        element: {
          host: 'col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-12',
          label: editable ? 'input-required' : '',
        },
        grid: {
          host: 'col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-12',
          label: editable ? 'input-required' : '',
        },
      },
      window_height: {
        element: {
          host: 'col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-12',
          label: editable ? 'input-required' : '',
        },
        grid: {
          host: 'col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-12',
          label: editable ? 'input-required' : '',
        },
      },
      window_left_width: {
        element: {
          host: 'col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-12',
          label: editable ? 'input-required' : '',
        },
        grid: {
          host: 'col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-12',
          label: editable ? 'input-required' : '',
        },
      },
      window_wall_depth: {
        element: {
          host: 'col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-12',
          label: editable ? 'input-required' : '',
        },
        grid: {
          host: 'col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-12',
          label: editable ? 'input-required' : '',
        },
      },
      window_under_height: {
        element: {
          host: 'col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-12',
          label: editable ? 'input-required' : '',
        },
        grid: {
          host: 'col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-12',
          label: editable ? 'input-required' : '',
        },
      },
      window_change: {
        element: {
          host: 'col-xl-3 col-lg-3 col-md-4 col-sm-6 col-xs-12 pt-3 pb-1',
          label: '',
        },
        grid: {
          host: 'col-xl-3 col-lg-3 col-md-4 col-sm-6 col-xs-12 pt-3 pb-1',
          label: '',
        },
      },
      window_blind_has_blind: {
        element: {
          host: 'col-xl-3 col-lg-3 col-md-4 col-sm-6 col-xs-12 pt-3 pb-1',
          label: '',
        },
        grid: {
          host: 'col-xl-3 col-lg-3 col-md-4 col-sm-6 col-xs-12 pt-3 pb-1',
          label: '',
        },
      },
      window_blind_is_motorized: {
        element: {
          host: 'col-xl-3 col-lg-3 col-md-4 col-sm-6 col-xs-12 pt-3 pb-1',
          label: '',
        },
        grid: {
          host: 'col-xl-3 col-lg-3 col-md-4 col-sm-6 col-xs-12 pt-3 pb-1',
          label: '',
        },
      },
      window_blind_change: {
        element: {
          host: 'col-xl-3 col-lg-3 col-md-5 col-sm-6 col-xs-12 pt-3 pb-1',
          label: '',
        },
        grid: {
          host: 'col-xl-3 col-lg-3 col-md-5 col-sm-6 col-xs-12 pt-3 pb-1',
          label: '',
        },
      },
      window_new_id: {
        element: {
          host: 'col-xl-8 col-lg-8 col-md-8 col-sm-8 col-xs-12',
          label: editable ? 'input-required' : '',
        },
        grid: {
          host: 'col-xl-8 col-lg-8 col-md-8 col-sm-8 col-xs-12',
          label: editable ? 'input-required' : '',
        },
      },
      window_new_price: {
        element: {
          host: 'col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-12',
          label: editable ? 'input-required' : '',
        },
        grid: {
          host: 'col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-12',
          label: editable ? 'input-required' : '',
        },
      },
      window_new_iva_percent: {
        element: {
          host: 'd-none',
        },
        grid: {
          host: 'd-none',
        },
      },
      window_labour_id: {
        element: {
          host: 'col-xl-8 col-lg-8 col-md-8 col-sm-8 col-xs-12',
          label: editable ? 'input-required' : '',
        },
        grid: {
          host: 'col-xl-8 col-lg-8 col-md-8 col-sm-8 col-xs-12',
          label: editable ? 'input-required' : '',
        },
      },
      window_labour_price: {
        element: {
          host: 'col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-12',
          label: editable ? 'input-required' : '',
        },
        grid: {
          host: 'col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-12',
          label: editable ? 'input-required' : '',
        },
      },
      window_labour_iva_percent: {
        element: {
          host: 'd-none',
        },
        grid: {
          host: 'd-none',
        },
      },
      window_blind_new_id: {
        element: {
          host: 'col-xl-8 col-lg-8 col-md-8 col-sm-8 col-xs-12',
          label: editable ? 'input-required' : '',
        },
        grid: {
          host: 'col-xl-8 col-lg-8 col-md-8 col-sm-8 col-xs-12',
          label: editable ? 'input-required' : '',
        },
      },
      window_blind_new_price: {
        element: {
          host: 'col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-12',
          label: editable ? 'input-required' : '',
        },
        grid: {
          host: 'col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-12',
          label: editable ? 'input-required' : '',
        },
      },
      window_blind_new_iva_percent: {
        element: {
          host: 'd-none',
        },
        grid: {
          host: 'd-none',
        },
      },
      window_blind_labour_id: {
        element: {
          host: 'col-xl-8 col-lg-8 col-md-8 col-sm-8 col-xs-12',
          label: editable ? 'input-required' : '',
        },
        grid: {
          host: 'col-xl-8 col-lg-8 col-md-8 col-sm-8 col-xs-12',
          label: editable ? 'input-required' : '',
        },
      },
      window_blind_labour_price: {
        element: {
          host: 'col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-12',
          label: editable ? 'input-required' : '',
        },
        grid: {
          host: 'col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-12',
          label: editable ? 'input-required' : '',
        },
      },
      window_blind_labour_iva_percent: {
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

    this.optionsLists['doors_opening_directions$'].next([
      {
        value: 'NONE_NONE',
        label: this.translatePipe.transform(
          _i18n('app.projects.ui.form.spaces.doors.opening_none')
        ),
      },
      {
        value: 'IN_LEFT',
        label: this.translatePipe.transform(
          _i18n('app.projects.ui.form.spaces.doors.opening_in_left')
        ),
      },
      {
        value: 'IN_RIGHT',
        label: this.translatePipe.transform(
          _i18n('app.projects.ui.form.spaces.doors.opening_in_right')
        ),
      },
      {
        value: 'OUT_LEFT',
        label: this.translatePipe.transform(
          _i18n('app.projects.ui.form.spaces.doors.opening_out_left')
        ),
      },
      {
        value: 'OUT_RIGHT',
        label: this.translatePipe.transform(
          _i18n('app.projects.ui.form.spaces.doors.opening_out_right')
        ),
      },
    ]);

    this.optionsLists['modules_trenches_directions$'].next([
      {
        value: 'NONE',
        label: this.translatePipe.transform(
          _i18n('app.projects.ui.form.spaces.modules.trenches_direction_none')
        ),
      },
      {
        value: 'LEFT',
        label: this.translatePipe.transform(
          _i18n('app.projects.ui.form.spaces.modules.trenches_direction_left')
        ),
      },
      {
        value: 'RIGHT',
        label: this.translatePipe.transform(
          _i18n('app.projects.ui.form.spaces.modules.trenches_direction_right')
        ),
      },
    ]);

    this.optionsKeys.forEach((optionsKey) => {
      optionsSubscribers[optionsKey + '$'] = new BehaviorSubject<any[]>([]);
      this.startLoader('Add-Edit-Space-Form-Options-' + optionsKey);
    });

    this.optionsListsService
      .getOptionsLists(this.optionsKeys, { orderByLabel: true })
      .results?.forEach((result) => {
        this.addSubscription(
          result.options$.pipe(take(1)).subscribe((options) => {
            // optionsSubscribers[optionsResult.key + '$']
            optionsSubscribers[result.fullKey + '$'].next([
              { label: '', value: '', item: {} },
              ...options,
            ]);
            this.endLoader('Add-Edit-Space-Form-Options-' + result.fullKey);
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

    const wallsFormGroupsArray = formCreated.get('walls') as FormArray;

    // update wall identifier in walls forms

    this.addSubscription(
      wallsFormGroupsArray.valueChanges
        .pipe(debounceTime(200), distinctUntilChanged())
        .subscribe(() => {
          wallsFormGroupsArray.controls.forEach(
            (wallFormGroup, index: number) => {
              const control = (wallFormGroup as FormGroup).get(
                'wall_identifier'
              );
              if (control) {
                const value =
                  String.fromCharCode('A'.charCodeAt(0) + index) +
                  ' - ' +
                  String.fromCharCode(
                    'A'.charCodeAt(0) +
                      (index < wallsFormGroupsArray.controls.length - 1
                        ? index + 1
                        : 0)
                  );
                control.setValue(value, {
                  emitEvent: false,
                });
              }
            }
          );
        })
    );

    // update walls_identifiers$ options for selects in doors and windows forms

    this.addSubscription(
      wallsFormGroupsArray.valueChanges
        .pipe(debounceTime(200), distinctUntilChanged())
        .subscribe(() => {
          const total = wallsFormGroupsArray.controls.length;
          const wall_identifiers: any[] = [];
          for (let index = 0; index < total; index++) {
            const value =
              String.fromCharCode('A'.charCodeAt(0) + index) +
              ' - ' +
              String.fromCharCode(
                'A'.charCodeAt(0) +
                  (index < wallsFormGroupsArray.controls.length - 1
                    ? index + 1
                    : 0)
              );

            wall_identifiers.push({
              label: value,
              value: value,
            });
          }

          this.optionsLists['walls_identifiers$'].next(wall_identifiers);
        })
    );

    // doors events

    const doorsFormGroupsArray = formCreated.get('doors') as FormArray;

    this.addSubscription(
      doorsFormGroupsArray.valueChanges
        .pipe(debounceTime(200), distinctUntilChanged())
        .subscribe(() => {
          const total = doorsFormGroupsArray.controls.length;
          for (let index = 0; index < total; index++) {
            const doorFormGroup = doorsFormGroupsArray.controls[
              index
            ] as FormGroup;

            const doorChangeFormControl = doorFormGroup.get(
              'door_change'
            ) as FormControl;

            const doorNewIdFormControl = doorFormGroup.get(
              'door_new_id'
            ) as FormControl;

            const doorNewPriceFormControl = doorFormGroup.get(
              'door_new_price'
            ) as FormControl;

            const doorNewIvaPercentFormControl = doorFormGroup.get(
              'door_new_iva_percent'
            ) as FormControl;

            const doorLabourIdFormControl = doorFormGroup.get(
              'door_labour_id'
            ) as FormControl;

            const doorLabourPriceFormControl = doorFormGroup.get(
              'door_labour_price'
            ) as FormControl;

            const doorLabourIvaPercentFormControl = doorFormGroup.get(
              'door_labour_iva_percent'
            ) as FormControl;

            const doorPhotosGalleryFormControl = doorFormGroup.get(
              'door_photos_gallery'
            ) as FormControl;

            // door product id and price events

            if (
              !(doorNewIdFormControl as any)
                .$$__hasValueChangesEventSubscription
            ) {
              (
                doorNewIdFormControl as any
              ).$$__hasValueChangesEventSubscription = true;

              this.addSubscription(
                doorNewIdFormControl.valueChanges
                  .pipe(debounceTime(200), distinctUntilChanged())
                  .subscribe(() => {
                    if (!this.editable || !doorNewIdFormControl.dirty) {
                      return;
                    }
                    const value = doorNewIdFormControl.value;
                    const options = this.optionsLists[
                      'products_doors__all$'
                    ].getValue() as any[];
                    const find = options.find((item) => item.value === value);

                    const price = Number.parseFloat(find?.item?.price);
                    doorNewPriceFormControl.setValue(
                      Number.isNaN(price) ? '0.00' : price.toFixed(2)
                    );
                    const price_iva_percent = Number.parseFloat(
                      find?.item?.iva_percent
                    );
                    doorNewIvaPercentFormControl.setValue(
                      Number.isNaN(price_iva_percent)
                        ? '0.00'
                        : price_iva_percent.toFixed(2)
                    );
                  })
              );
            }

            // door labour id and price events

            if (
              !(doorLabourIdFormControl as any)
                .$$__hasValueChangesEventSubscription
            ) {
              (
                doorLabourIdFormControl as any
              ).$$__hasValueChangesEventSubscription = true;
              this.addSubscription(
                doorLabourIdFormControl.valueChanges
                  .pipe(debounceTime(200), distinctUntilChanged())
                  .subscribe(() => {
                    if (!this.editable || !doorLabourIdFormControl.dirty) {
                      return;
                    }
                    const value = doorLabourIdFormControl.value;
                    const options = this.optionsLists[
                      'labours__doors$'
                    ].getValue() as any[];
                    const find = options.find((item) => item.value === value);

                    const price = Number.parseFloat(find?.item?.price);
                    doorLabourPriceFormControl.setValue(
                      Number.isNaN(price) ? '0.00' : price.toFixed(2)
                    );
                    const price_iva_percent = Number.parseFloat(
                      find?.item?.iva_percent
                    );
                    doorLabourIvaPercentFormControl.setValue(
                      Number.isNaN(price_iva_percent)
                        ? '0.00'
                        : price_iva_percent.toFixed(2)
                    );
                  })
              );
            }

            // door_change events

            if (
              !(doorChangeFormControl as any)
                .$$__hasValueChangesEventSubscription
            ) {
              (
                doorChangeFormControl as any
              ).$$__hasValueChangesEventSubscription = true;

              this.addSubscription(
                doorChangeFormControl.valueChanges
                  .pipe(debounceTime(200), distinctUntilChanged())
                  .subscribe(() => {
                    const value = doorChangeFormControl.value;
                    if (value !== true) {
                      doorNewIdFormControl.setValue(null);
                      doorNewPriceFormControl.setValue('0.00');
                      doorLabourIdFormControl.setValue(null);
                      doorLabourPriceFormControl.setValue('0.00');
                      doorPhotosGalleryFormControl.setValue([]);
                    }
                  })
              );

              setTimeout(() => {
                doorChangeFormControl.setValue(doorChangeFormControl.value);
              }, 100);
            }
          }
        })
    );

    // windows and blinds events

    const windowsFormGroupsArray = formCreated.get('windows') as FormArray;

    this.addSubscription(
      windowsFormGroupsArray.valueChanges
        .pipe(debounceTime(200), distinctUntilChanged())
        .subscribe(() => {
          const total = windowsFormGroupsArray.controls.length;

          for (let index = 0; index < total; index++) {
            const windowFormGroup = windowsFormGroupsArray.controls[
              index
            ] as FormGroup;

            const windowChangeFormControl = windowFormGroup.get(
              'window_change'
            ) as FormControl;

            const windowNewIdFormControl = windowFormGroup.get(
              'window_new_id'
            ) as FormControl;

            const windowNewPriceFormControl = windowFormGroup.get(
              'window_new_price'
            ) as FormControl;

            const windowNewIvaPercentFormControl = windowFormGroup.get(
              'window_new_iva_percent'
            ) as FormControl;

            const windowLabourIdFormControl = windowFormGroup.get(
              'window_labour_id'
            ) as FormControl;

            const windowLabourPriceFormControl = windowFormGroup.get(
              'window_labour_price'
            ) as FormControl;

            const windowLabourIvaPercentFormControl = windowFormGroup.get(
              'window_labour_iva_percent'
            ) as FormControl;

            const hasBlindFormControl = windowFormGroup.get(
              'window_blind_has_blind'
            ) as FormControl;

            const blindChangeFormControl = windowFormGroup.get(
              'window_blind_change'
            ) as FormControl;

            const blindNewIdFormControl = windowFormGroup.get(
              'window_blind_new_id'
            ) as FormControl;

            const blindNewPriceFormControl = windowFormGroup.get(
              'window_blind_new_price'
            ) as FormControl;

            const blindNewIvaPercentFormControl = windowFormGroup.get(
              'window_blind_new_iva_percent'
            ) as FormControl;

            const blindLabourIdFormControl = windowFormGroup.get(
              'window_blind_labour_id'
            ) as FormControl;

            const blindLabourPriceFormControl = windowFormGroup.get(
              'window_blind_labour_price'
            ) as FormControl;

            const blindLabourIvaPercentFormControl = windowFormGroup.get(
              'window_blind_labour_iva_percent'
            ) as FormControl;

            const windowPhotosGalleryFormControl = windowFormGroup.get(
              'window_photos_gallery'
            ) as FormControl;

            // window product id and price events

            if (
              !(windowNewIdFormControl as any)
                .$$__hasValueChangesEventSubscription
            ) {
              (
                windowNewIdFormControl as any
              ).$$__hasValueChangesEventSubscription = true;
              this.addSubscription(
                windowNewIdFormControl.valueChanges
                  .pipe(debounceTime(200), distinctUntilChanged())
                  .subscribe(() => {
                    if (!this.editable || !windowNewIdFormControl.dirty) {
                      return;
                    }
                    const value = windowNewIdFormControl.value;

                    const options =
                      this.optionsLists['products_windows__all$'].getValue();
                    const find = options.find((item) => item.value === value);

                    const price = Number.parseFloat(find?.item?.price);
                    windowNewPriceFormControl.setValue(
                      Number.isNaN(price) ? '0.00' : price.toFixed(2)
                    );
                    const price_iva_percent = Number.parseFloat(
                      find?.item?.iva_percent
                    );
                    windowNewIvaPercentFormControl.setValue(
                      Number.isNaN(price_iva_percent)
                        ? '0.00'
                        : price_iva_percent.toFixed(2)
                    );
                  })
              );
            }

            // window labour id and price events

            if (
              !(windowLabourIdFormControl as any)
                .$$__hasValueChangesEventSubscription
            ) {
              (
                windowLabourIdFormControl as any
              ).$$__hasValueChangesEventSubscription = true;
              this.addSubscription(
                windowLabourIdFormControl.valueChanges
                  .pipe(debounceTime(200), distinctUntilChanged())
                  .subscribe(() => {
                    if (!this.editable || !windowLabourIdFormControl.dirty) {
                      return;
                    }
                    const value = windowLabourIdFormControl.value;

                    const options =
                      this.optionsLists['labours__windows$'].getValue();
                    const find = options.find((item) => item.value === value);

                    const price = Number.parseFloat(find?.item?.price);
                    windowLabourPriceFormControl.setValue(
                      Number.isNaN(price) ? '0.00' : price.toFixed(2)
                    );
                    const price_iva_percent = Number.parseFloat(
                      find?.item?.iva_percent
                    );
                    windowLabourIvaPercentFormControl.setValue(
                      Number.isNaN(price_iva_percent)
                        ? '0.00'
                        : price_iva_percent.toFixed(2)
                    );
                  })
              );
            }

            // window_change events

            if (
              !(windowChangeFormControl as any)
                .$$__hasValueChangesEventSubscription
            ) {
              (
                windowChangeFormControl as any
              ).$$__hasValueChangesEventSubscription = true;

              this.addSubscription(
                windowChangeFormControl.valueChanges
                  .pipe(debounceTime(200), distinctUntilChanged())
                  .subscribe(() => {
                    const value = windowChangeFormControl.value;
                    if (value !== true) {
                      windowNewIdFormControl.setValue(null);
                      windowNewPriceFormControl.setValue('0.00');
                      windowLabourIdFormControl.setValue(null);
                      windowLabourPriceFormControl.setValue('0.00');
                    }
                    if (
                      windowChangeFormControl.value !== true &&
                      blindChangeFormControl.value !== true
                    ) {
                      windowPhotosGalleryFormControl.setValue([]);
                    }
                  })
              );

              setTimeout(() => {
                windowChangeFormControl.setValue(windowChangeFormControl.value);
              }, 100);
            }

            // has blind events

            if (
              !(hasBlindFormControl as any).$$__hasValueChangesEventSubscription
            ) {
              (
                hasBlindFormControl as any
              ).$$__hasValueChangesEventSubscription = true;

              this.addSubscription(
                hasBlindFormControl.valueChanges
                  .pipe(debounceTime(200), distinctUntilChanged())
                  .subscribe(() => {
                    const value = hasBlindFormControl.value;
                    if (value !== true) {
                      (
                        windowFormGroup.get(
                          'window_blind_is_motorized'
                        ) as FormControl
                      ).setValue(false);
                      (
                        windowFormGroup.get(
                          'window_blind_change'
                        ) as FormControl
                      ).setValue(false);
                    }
                  })
              );

              setTimeout(() => {
                hasBlindFormControl.setValue(hasBlindFormControl.value);
              }, 100);
            }

            // blind product id and price events

            if (
              !(blindNewIdFormControl as any)
                .$$__hasValueChangesEventSubscription
            ) {
              (
                blindNewIdFormControl as any
              ).$$__hasValueChangesEventSubscription = true;
              this.addSubscription(
                blindNewIdFormControl.valueChanges
                  .pipe(debounceTime(200), distinctUntilChanged())
                  .subscribe(() => {
                    if (!this.editable || !blindNewIdFormControl.dirty) {
                      return;
                    }
                    const value = blindNewIdFormControl.value;

                    const options =
                      this.optionsLists['products_blinds__all$'].getValue();
                    const find = options.find((item) => item.value === value);

                    const price = Number.parseFloat(find?.item?.price);
                    blindNewPriceFormControl.setValue(
                      Number.isNaN(price) ? '0.00' : price.toFixed(2)
                    );
                    const price_iva_percent = Number.parseFloat(
                      find?.item?.iva_percent
                    );
                    blindNewIvaPercentFormControl.setValue(
                      Number.isNaN(price_iva_percent)
                        ? '0.00'
                        : price_iva_percent.toFixed(2)
                    );
                  })
              );
            }

            // blind labour id and price events

            if (
              !(blindLabourIdFormControl as any)
                .$$__hasValueChangesEventSubscription
            ) {
              (
                blindLabourIdFormControl as any
              ).$$__hasValueChangesEventSubscription = true;
              this.addSubscription(
                blindLabourIdFormControl.valueChanges
                  .pipe(debounceTime(200), distinctUntilChanged())
                  .subscribe(() => {
                    if (!this.editable || !blindLabourIdFormControl.dirty) {
                      return;
                    }
                    const value = blindLabourIdFormControl.value;

                    const options =
                      this.optionsLists['labours__blinds$'].getValue();
                    const find = options.find((item) => item.value === value);

                    const price = Number.parseFloat(find?.item?.price);
                    blindLabourPriceFormControl.setValue(
                      Number.isNaN(price) ? '0.00' : price.toFixed(2)
                    );
                    const price_iva_percent = Number.parseFloat(
                      find?.item?.iva_percent
                    );
                    blindLabourIvaPercentFormControl.setValue(
                      Number.isNaN(price_iva_percent)
                        ? '0.00'
                        : price_iva_percent.toFixed(2)
                    );
                  })
              );
            }

            // blind_change events

            if (
              !(blindChangeFormControl as any)
                .$$__hasValueChangesEventSubscription
            ) {
              (
                blindChangeFormControl as any
              ).$$__hasValueChangesEventSubscription = true;

              this.addSubscription(
                blindChangeFormControl.valueChanges
                  .pipe(debounceTime(200), distinctUntilChanged())
                  .subscribe(() => {
                    const value = blindChangeFormControl.value;
                    if (value !== true) {
                      blindNewIdFormControl.setValue(null);
                      blindNewPriceFormControl.setValue('0.00');
                      blindLabourIdFormControl.setValue(null);
                      blindLabourPriceFormControl.setValue('0.00');
                    }
                    if (
                      windowChangeFormControl.value !== true &&
                      blindChangeFormControl.value !== true
                    ) {
                      windowPhotosGalleryFormControl.setValue([]);
                    }
                  })
              );

              setTimeout(() => {
                blindChangeFormControl.setValue(blindChangeFormControl.value);
              }, 100);
            }
          }
        })
    );

    this.formGroup = event as FormGroup;

    this.formGroupCreated.emit(event as FormGroup);
  }

  // -------------------------------------------------------------------------

  protected onDeleteSpaceItem(event: any): void {
    this.deleteItem.emit(event);
  }

  // -------------------------------------------------------------------------

  protected onModuleFormGroupCreated(event: any, index: number): void {
    if (
      this.formGroup &&
      this.formGroup.get('modules') &&
      (this.formGroup.get('modules') as FormArray).controls &&
      (this.formGroup.get('modules') as FormArray).controls[index]
    ) {
      (
        (this.formGroup.get('modules') as FormArray).controls[index] as any
      ).$$__embedded = event;
    }
  }

  // -------------------------------------------------------------------------

  protected isItemsChangeChecked(
    group: DynamicInputModel[],
    context: DynamicFormArrayModel
  ): boolean {
    const contextId = context.id;
    let doors_find: any = null;
    let windows_find: any = null;
    let blinds_find: any = null;
    switch (contextId) {
      case 'doors':
        doors_find = group.find((item) => item.id === 'door_change');
        if (doors_find) {
          return !!doors_find?.value;
        }
        return false;
      case 'windows':
        windows_find = group.find((item) => item.id === 'window_change');
        blinds_find = group.find((item) => item.id === 'window_blind_change');
        if (windows_find || blinds_find) {
          return !!windows_find?.value || !!blinds_find?.value;
        }
        return false;
      case 'modules':
        return false;
    }
    return false;
  }

  // -------------------------------------------------------------------------

  protected getPhotosGalleryIdByGroup(
    group: DynamicInputModel[],
    context: DynamicFormArrayModel
  ): string {
    const contextId = context.id;
    switch (contextId) {
      case 'doors':
        return 'door_photos_gallery';
      case 'windows':
        return 'window_photos_gallery';
      case 'modules':
        return 'module_photos_gallery';
      default:
        return 'photos_gallery';
    }
    // return 'photos_gallery';
  }

  // -------------------------------------------------------------------------
}
