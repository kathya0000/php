/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core';

@Component({
  selector: 'app-dashboard-docs-example',
  templateUrl: './docs-example.component.html',
  styleUrls: ['./docs-example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocsExampleComponent implements AfterContentInit, AfterViewInit {
  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  @Input() fragment?: string;

  private _href = 'https://coreui.io/angular/docs/';

  get href(): string {
    return this._href;
  }

  @Input()
  set href(value: string) {
    const version = '1.0.0';
    const docsUrl = 'https://coreui.io/angular/';
    // const path: string = version ? `${version}/#/${value}` : '#';
    // const path: string = version ? `${version}/${value}` : '';
    this._href = `${docsUrl}${value}`;
  }

  ngAfterContentInit(): void {
    this.changeDetectorRef.detectChanges();
  }

  ngAfterViewInit(): void {
    this.changeDetectorRef.markForCheck();
  }
}
