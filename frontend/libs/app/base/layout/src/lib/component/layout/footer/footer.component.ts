/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input, inject, isDevMode } from '@angular/core';
import { FooterComponent as CoreUiFooterComponent } from '@coreui/angular';
import { APP_ENV_TOKEN } from '@apps/app-base-api';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent extends CoreUiFooterComponent {
  version: string = inject(APP_ENV_TOKEN).appVersion;

  @Input() sidebarId: string = 'sidebar';

  protected readonly __isDevMode = isDevMode();

  constructor() {
    super();
  }

  onSideBarToggle($event: any): void {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);
  }

  protected isVisibleDevBtn(): boolean {
    return this.__isDevMode;
  }

  protected isDisabledDevBtn(): boolean {
    return !this.__isDevMode;
  }

  protected onClickDevBtn($event: any): void {
    window.dispatchEvent(new Event('dev-button-clicked'));
  }
}
