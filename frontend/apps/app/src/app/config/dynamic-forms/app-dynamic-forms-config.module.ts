import { CommonModule } from '@angular/common';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { APP_DYNAMIC_FORMS_CONFIG } from './app-dynamic-forms.config';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    // ----------------
  ],
  providers: [...APP_DYNAMIC_FORMS_CONFIG.providers],
  exports: [],
})
export class AppDynamicFormsConfigModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: AppDynamicFormsConfigModule
  ) {
    if (parentModule) {
      throw new Error(
        'AppDynamicFormsConfigModule is already loaded. Import it in the main config module only.'
      );
    }
  }
}
