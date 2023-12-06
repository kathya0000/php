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
export class EditComponent
  extends AbstractAddEditComponent
  implements OnInit, OnDestroy
{
  constructor() {
    super();
    this.elementIsNew = false;
  }
}
