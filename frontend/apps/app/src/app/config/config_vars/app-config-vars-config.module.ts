/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { inject, NgModule, Optional, SkipSelf } from '@angular/core';

import { APP_CONFIG_VARS } from './app-config-vars.config';
import { APP_CONFIG_VARS_TOKEN } from '@apps/app-base-api';
import { LoggerService } from '@ng-techpromux-archetype-project/core-util';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [
    {
      provide: APP_CONFIG_VARS_TOKEN,
      useValue: APP_CONFIG_VARS,
    },
  ],
  exports: [],
})
export class AppEnvVarsConfigModule {
  logger: LoggerService = inject<LoggerService>(LoggerService);

  constructor(
    @Optional()
    @SkipSelf()
    parentModule: AppEnvVarsConfigModule
  ) {
    if (parentModule) {
      throw new Error(
        'AppEnvVarsConfigModule is already loaded. Import it in the main config module only.'
      );
    }
    this.init();
  }

  private init(): void {
    this.logger.console.debug('AppEnvVarsConfigModule', 'init');
  }
}
