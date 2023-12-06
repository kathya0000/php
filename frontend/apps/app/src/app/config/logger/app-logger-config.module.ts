/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { NgModule, Optional, SkipSelf, isDevMode } from '@angular/core';
import { UtilLoggerModule } from '@ng-techpromux-archetype-project/core-util';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { APP_CONFIG_VARS } from '../config_vars/app-config-vars.config';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    LoggerModule.forRoot({
      // serverLoggingUrl: '/api/logs',
      level:
        NgxLoggerLevel[
          (!isDevMode()
            ? 'OFF'
            : APP_CONFIG_VARS.LOGGER_LEVEL) as keyof typeof NgxLoggerLevel
        ],
      serverLogLevel:
        NgxLoggerLevel[
          (!isDevMode()
            ? 'OFF'
            : APP_CONFIG_VARS.LOGGER_SERVER_LEVEL) as keyof typeof NgxLoggerLevel
        ],
    }),
    UtilLoggerModule
  ],
  providers: [],
  exports: [],
})
export class AppLoggerConfigModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: AppLoggerConfigModule
  ) {
    if (parentModule) {
      throw new Error(
        'AppLoggerConfigModule is already loaded. Import it in the main config module only.'
      );
    }
  }
}
