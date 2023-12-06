/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { NgModule, Optional, SkipSelf, inject } from '@angular/core';
import {
  CoreServiceFlowModule,
  FlowService,
} from '@ng-techpromux-archetype-project/core-service';
import { LoggerService } from '@ng-techpromux-archetype-project/core-util';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    // ----------------
    // App Flow
    // ----------------
    CoreServiceFlowModule,
    // ----------------
  ],
  providers: [],
  exports: [CoreServiceFlowModule],
})
export class AppFlowConfigModule {
  private logger: LoggerService = inject<LoggerService>(LoggerService);

  private flow: FlowService =
    inject<FlowService>(FlowService);

  constructor(
    @Optional()
    @SkipSelf()
    parentModule: AppFlowConfigModule
  ) {
    if (parentModule) {
      throw new Error(
        'AppFlowConfigModule is already loaded. Import it in the main config module only.'
      );
    }

    this.init();
  }

  private init(): void {
    // -----------------------------
    this.initFlowConfiguration();
    // -----------------------------
    // this.initAccessVerificationToDeniedUrl();
    // -----------------------------
  }

  private initFlowConfiguration(): void {
    this.logger.console.debug('AppFlowConfigModule', 'initFlowConfiguration');
    this.flow.init();
  }
}
