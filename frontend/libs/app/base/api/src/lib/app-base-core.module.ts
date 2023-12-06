import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, Optional, SkipSelf, inject } from '@angular/core';
import { AppBaseDomainModule } from '@apps/app-base-domain';
import { AppBaseUiCoreModule } from '@apps/app-base-ui';
import { LoggerService } from '@ng-techpromux-archetype-project/core-util';

@NgModule({
  imports: [
    // ---------------------------------
    CommonModule,
    HttpClientModule,
    // --------------------------------
    AppBaseDomainModule,
    AppBaseUiCoreModule,
    // --------------------------------
  ],
  providers: [],
  exports: [AppBaseUiCoreModule],
})
export class AppBaseCoreModule {
  private logger: LoggerService = inject<LoggerService>(LoggerService);

  constructor(
    @Optional()
    @SkipSelf()
    parentModule: AppBaseCoreModule
  ) {
    if (parentModule) {
      throw new Error(
        'AppBaseCoreModule is already loaded. Import it in the AppModule only.'
      );
    }
    this.init();
  }

  private init(): void {
    this.logger.console.debug('AppBaseCoreModule', 'init');
  }
}
