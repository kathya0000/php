/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { NgModule, Optional, SkipSelf, inject, isDevMode } from '@angular/core';
import { ActivatedRoute, Event, NavigationEnd, Router } from '@angular/router';
import { AbstractFeatureComponent } from '@ng-techpromux-archetype-project/core-ddd';
import { ExtAngularDisableBrowserBackButtonModule } from '@ng-techpromux-archetype-project/ext-angular-disable-browser-back-button';
import {
  LoggerService,
  UtilCodeModule,
} from '@ng-techpromux-archetype-project/core-util';
import { filter } from 'rxjs';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    //-----------------
    UtilCodeModule,
    //-----------------
    // Back Button Disabled
    //-----------------
    ExtAngularDisableBrowserBackButtonModule,
    // ----------------
  ],
  providers: [],
  exports: [],
})
export class AppCodeConfigModule {
  private logger: LoggerService = inject<LoggerService>(LoggerService);

  private router: Router = inject<Router>(Router);

  private activatedRoute: ActivatedRoute =
    inject<ActivatedRoute>(ActivatedRoute);

  constructor(
    @Optional()
    @SkipSelf()
    parentModule: AppCodeConfigModule
  ) {
    if (parentModule) {
      throw new Error(
        'AppCodeConfigModule is already loaded. Import it in the main config module only.'
      );
    }

    this.init();
  }

  private init(): void {
    this.logger.console.debug('AppCodeConfigModule', 'init');

    this.logger.console.debug(
      'AppCodeConfigModule',
      'check AbstractFeatureComponent feature implementation'
    );

    const production = !isDevMode();

    this.router.events
      .pipe(filter((evt) => evt instanceof NavigationEnd))
      .subscribe((evt: Event) => {
        let route = this.activatedRoute.firstChild;
        let child = route;
        while (child) {
          if (child.firstChild) {
            child = child.firstChild;
            route = child;
          } else {
            child = null;
          }
        }
        const component: any | null = route?.component;
        if (
          !production &&
          component &&
          !(component.prototype instanceof AbstractFeatureComponent)
        ) {
          const error =
            'Component [' +
            component.prototype.constructor.name +
            '] must inherit from [AbstractFeatureComponent]';
          this.logger.console.warn('AppCodeConfigModule', error);
          // throwError(error);
        }
      });
  }
}
