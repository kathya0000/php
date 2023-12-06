/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { inject, NgModule, Optional, SkipSelf } from '@angular/core';
import {
  CoreServiceOptionsListsManagerModule,
  CoreServiceOptionsListsProviderModule,
  OPTIONS_LISTS_MANAGER_SERVICE_TOKEN,
  OptionsListsManagerService,
} from '@ng-techpromux-archetype-project/core-service';
import { LoggerService } from '@ng-techpromux-archetype-project/core-util';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    //-----------------
    CoreServiceOptionsListsManagerModule,
    CoreServiceOptionsListsProviderModule,
    // ----------------
  ],
  providers: [],
  exports: [],
})
export class AppOptionsListsConfigModule {
  private logger: LoggerService = inject<LoggerService>(LoggerService);

  private optionsLists: OptionsListsManagerService =
    inject<OptionsListsManagerService>(OPTIONS_LISTS_MANAGER_SERVICE_TOKEN);

  constructor(
    @Optional()
    @SkipSelf()
    parentModule: AppOptionsListsConfigModule
  ) {
    if (parentModule) {
      throw new Error(
        'AppOptionsListsConfigModule is already loaded. Import it in the main config module only.'
      );
    }

    this.init();
  }

  private init(): void {
    this.logger.console.debug('AppOptionsListsConfigModule', 'init');

    this.optionsLists.init();
  }
}
