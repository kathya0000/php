/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { inject, NgModule, Optional, SkipSelf } from '@angular/core';
import { CoreUiLoaderModule } from '@ng-techpromux-archetype-project/core-ui';
import { LoggerService } from '@ng-techpromux-archetype-project/core-util';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    //-----------------
    CoreUiLoaderModule,
    // ----------------
  ],
  providers: [],
  exports: [CoreUiLoaderModule],
})
export class AppLoaderConfigModule {
  private logger: LoggerService = inject<LoggerService>(LoggerService);

  constructor(
    @Optional()
    @SkipSelf()
    parentModule: AppLoaderConfigModule
  ) {
    if (parentModule) {
      throw new Error(
        'AppLoaderConfigModule is already loaded. Import it in the main config module only.'
      );
    }

    this.init();
  }

  private init(): void {
    this.logger.console.debug('AppLoaderConfigModule', 'init');
  }
}
