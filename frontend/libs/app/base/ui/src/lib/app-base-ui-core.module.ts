import { CommonModule } from '@angular/common';
import { NgModule, Optional, SkipSelf, inject } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IconSetService } from '@coreui/icons-angular';

import {
  PERFECT_SCROLLBAR_CONFIG,
  PerfectScrollbarConfigInterface,
} from '@ng-techpromux-archetype-project/ext-ngx-perfect-scrollbar';

import { LoggerService } from '@ng-techpromux-archetype-project/core-util';

import { CoreServiceTranslationModule } from '@ng-techpromux-archetype-project/core-service';
import {
  BsDatepickerConfig,
  BsDatepickerInlineConfig,
  BsDatepickerModule,
  BsDaterangepickerConfig,
  BsDaterangepickerInlineConfig,
} from 'ngx-bootstrap/datepicker';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
};

@NgModule({
  imports: [
    CommonModule,
    // ---------------------------------
    FormsModule,
    ReactiveFormsModule,
    // ---------------------------------
    CoreServiceTranslationModule,
    // ---------------------------------
    BsDatepickerModule.forRoot(),
    // ---------------------------------
  ],
  providers: [
    BsDatepickerConfig,
    BsDatepickerInlineConfig,
    BsDaterangepickerConfig,
    BsDaterangepickerInlineConfig,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
    IconSetService,
  ],
  exports: [
    // ---------------------------------
    FormsModule,
    ReactiveFormsModule,
    // ---------------------------------
    CoreServiceTranslationModule,
    // ---------------------------------
  ],
})
export class AppBaseUiCoreModule {
  private logger: LoggerService = inject<LoggerService>(LoggerService);

  constructor(
    @Optional()
    @SkipSelf()
    parentModule: AppBaseUiCoreModule
  ) {
    if (parentModule) {
      throw new Error(
        'AppBaseUiCoreModule is already loaded. Import it in the AppModule only.'
      );
    }
    this.init();
  }

  private init(): void {
    this.logger.console.debug('AppBaseUiCoreModule', 'init');
  }
}
