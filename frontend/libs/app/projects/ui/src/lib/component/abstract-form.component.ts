/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  DynamicFormLayout,
  DynamicFormModel,
  DynamicFormService,
} from '@ng-dynamic-forms/core';

import { marker as _i18n } from '@biesbjerg/ngx-translate-extract-marker';

import { TranslatePipe } from '@ngx-translate/core';

import { AbstractUiComponent } from '@ng-techpromux-archetype-project/core-ddd';
import {
  OPTIONS_LISTS_MANAGER_SERVICE_TOKEN,
  OptionsListsManagerService,
} from '@ng-techpromux-archetype-project/core-service';
import { OptionItemLabelPipe } from '@ng-techpromux-archetype-project/core-ui';
import { UtilUuidService } from '@ng-techpromux-archetype-project/core-util';
import { BehaviorSubject } from 'rxjs';

@Component({
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export abstract class AbstractUiFormComponent
  extends AbstractUiComponent
  implements OnInit, OnDestroy, OnChanges
{
  // -------------------------------------------------------------------------

  formGroup: FormGroup | null = null;

  formModel: DynamicFormModel = [];

  formLayout!: DynamicFormLayout;

  // -------------------------------------------------------------------------

  @Input() initialData: any = {};

  @Input() editable: boolean = true;

  @Input() optionsKeys: string[] = this.getDefaultOptionsKeys();

  @Input() optionsLists: { [id: string]: BehaviorSubject<any[]> } = this.getDefaultOptionsLists();

  @Output() formGroupCreated: EventEmitter<any> = new EventEmitter<any>();

  @Output() formModelUpdated: EventEmitter<any> = new EventEmitter<any>();

  @Output() deleteItem: EventEmitter<any> = new EventEmitter<any>();

  // -------------------------------------------------------------------------

  protected translatePipe = inject<TranslatePipe>(TranslatePipe);

  protected optionItemLabelPipe: OptionItemLabelPipe =
    inject<OptionItemLabelPipe>(OptionItemLabelPipe);

  protected formService = inject<DynamicFormService>(DynamicFormService);

  protected optionsListsService: OptionsListsManagerService =
    inject<OptionsListsManagerService>(OPTIONS_LISTS_MANAGER_SERVICE_TOKEN);

  protected uuidService: UtilUuidService =
    inject<UtilUuidService>(UtilUuidService);

  // -------------------------------------------------------------------------

  constructor() {
    super();
  }

  // -------------------------------------------------------------------------

  override onInitOrOnChanges(changes: SimpleChanges) {
    super.onInitOrOnChanges(changes);

    this.optionsLists = {
      ...this.optionsLists,
      ...this.getOptionsListsData(this.editable),
    };

    this.formLayout = this.getFormLayout(this.editable);

    this.formModel = this.getFormModel(this.editable);
  }

  // -------------------------------------------------------------------------

  protected abstract getDefaultOptionsKeys(): string[];

  protected abstract getDefaultOptionsLists(): {
    [id: string]: BehaviorSubject<any[]>;
  };

  // -------------------------------------------------------------------------

  protected abstract getFormModel(editable: boolean): DynamicFormModel;

  protected abstract getFormLayout(editable: boolean): DynamicFormLayout;

  protected abstract getOptionsListsData(editable: boolean): {
    [id: string]: BehaviorSubject<any[]>;
  };

  // -------------------------------------------------------------------------

  protected abstract onFormGroupCreated(event: any): void;

  protected onFormModelUpdated(event: any): void {
    this.formModelUpdated.emit(event as DynamicFormModel);
  }

  // -------------------------------------------------------------------------

  protected defaultFormArrayEndTplLayout = {
    classes: {
      actions_container: 'df-actions_container d-flex justify-content-end col',
      actions_label: 'df-actions_label d-none- d-xs-block',
      actions_text_align:
        'df-actions_text_align text-right d-flex align-items-end',
      actions_btn_insert:
        'df-actions_btn_insert btn btn-outline-dark text-nowrap me-2',
      actions_btn_insert_icon: 'df-actions_btn_insert_icon',
      actions_btn_insert_icon_name: 'cib-addthis',
      actions_btn_add:
        'df-actions_btn_add btn btn-outline-dark text-nowrap me-2',
      actions_btn_add_icon: 'df-actions_btn_add_icon',
      actions_btn_add_icon_name: 'cib-addthis',
      actions_btn_remove:
        'df-actions_btn_remove btn btn-outline-danger text-nowrap',
      actions_btn_remove_icon: 'df-actions_btn_remove_icon',
      actions_btn_remove_icon_name: 'cil-trash',
    },
    labels: {
      actions_btn_insert_lbl: _i18n(
        'ui.dynamic-forms.arrays.actions_btn_insert_lbl'
      ),
      actions_btn_insert_title: _i18n(
        'ui.dynamic-forms.arrays.actions_btn_insert_title'
      ),
      actions_btn_add_lbl: _i18n('ui.dynamic-forms.arrays.actions_btn_add_lbl'),
      actions_btn_add_title: _i18n(
        'ui.dynamic-forms.arrays.actions_btn_add_title'
      ),
      actions_btn_remove_lbl: _i18n(
        'ui.dynamic-forms.arrays.actions_btn_remove_lbl'
      ),
      actions_btn_remove_title: _i18n(
        'ui.dynamic-forms.arrays.actions_btn_remove_lbl'
      ),
    },
    behaviors: {
      show_actions_btn_insert: true,
      show_actions_btn_add: true,
      show_actions_btn_remove: true,

      disable_action_btn_remove_in_only_item: true,

      show_hr_line_between_items: false,
      show_hr_line_in_last_item: false,
    },
  };
}
