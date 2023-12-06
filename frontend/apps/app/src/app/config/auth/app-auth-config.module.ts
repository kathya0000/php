/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { NgModule, Optional, SkipSelf, inject } from '@angular/core';
import {
  AUTH_MANAGER_DEFAULT_CONFIG_TOKEN,
  AUTH_PROVIDER_LARAVEL9_CONFIG_TOKEN,
  AuthChangeTokenStoreAction,
  AuthDoLoginSuccessfullyStoreAction,
  AuthDoLogoutSuccessfullyStoreAction,
  CoreAuthManagerModule,
  CoreAuthProviderLaravel9Module,
} from '@ng-techpromux-archetype-project/core-auth';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  AUTH_HTTP_INTERCEPTOR_APIS_PREFIXES_CONFIG_TOKEN,
  HttpRequestAppendAuthorizationTokenToApiCallInterceptor,
  HttpResponseAuthorizationErrorInterceptor,
} from '@ng-techpromux-archetype-project/core-auth';
import {
  Laravel9ApiClientModule,
  CORE_SERVICE_API_CLIENT_LARAVEL9_API_BASE_PATH,
  FlowService,
} from '@ng-techpromux-archetype-project/core-service';
import { LoggerService } from '@ng-techpromux-archetype-project/core-util';
import { Navigate } from '@ngxs/router-plugin';
import { Actions, Store, ofActionDispatched } from '@ngxs/store';
import { firstValueFrom } from 'rxjs';
import { APP_API_CONFIG } from '../api/app-api.config';
import { APP_AUTH_CONFIG } from './app-auth.config';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    // ----------------
    // App Auth Manager
    // ----------------
    CoreAuthManagerModule,
    // ----------------
    // App Auth Providers
    // ----------------
    Laravel9ApiClientModule,
    CoreAuthProviderLaravel9Module,
    // ----------------
  ],
  providers: [
    // ----------------
    // App Auth Manager
    // ----------------
    {
      provide: AUTH_MANAGER_DEFAULT_CONFIG_TOKEN,
      useValue: APP_AUTH_CONFIG,
    },
    // ----------------
    // App Auth Providers
    // ----------------
    {
      provide: AUTH_PROVIDER_LARAVEL9_CONFIG_TOKEN,
      useValue: APP_AUTH_CONFIG.providers.LARAVEL9,
    },
    {
      provide: CORE_SERVICE_API_CLIENT_LARAVEL9_API_BASE_PATH,
      useValue: APP_API_CONFIG.laravel9_api_base_path,
    },
    // ----------------
    // App Auth Interceptors
    // ----------------
    {
      provide: AUTH_HTTP_INTERCEPTOR_APIS_PREFIXES_CONFIG_TOKEN,
      useValue: [
        APP_API_CONFIG.laravel9_api_base_path,
      ],
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpResponseAuthorizationErrorInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpRequestAppendAuthorizationTokenToApiCallInterceptor,
      multi: true,
    },
  ],
  exports: [
    // CoreAuthGuardModule
  ],
})
export class AppAuthConfigModule {
  private logger: LoggerService = inject<LoggerService>(LoggerService);

  private flow: FlowService = inject<FlowService>(FlowService);

  private store: Store = inject<Store>(Store);

  private actions$: Actions = inject<Actions>(Actions);

  constructor(
    @Optional()
    @SkipSelf()
    parentModule: AppAuthConfigModule
  ) {
    if (parentModule) {
      throw new Error(
        'AppAuthConfigModule is already loaded. Import it in the main config module only.'
      );
    }

    this.init();
  }

  private init(): void {
    this.logger.console.debug('AppAuthConfigModule', 'init');

    this.actions$
      .pipe(ofActionDispatched(AuthDoLoginSuccessfullyStoreAction))
      .subscribe((action: AuthDoLoginSuccessfullyStoreAction) => {
        if (action.loggedIn) {
          this.logger.console.debug(
            'AppAuthConfigModule',
            'Logged -> In !!!',
            action.loggedIn
          );

          this.flow.closeAll(true).then(() => {
            this.goToDefaultUserPageAfterLogin();
          });
        }
      });

    this.actions$
      .pipe(ofActionDispatched(AuthChangeTokenStoreAction))
      .subscribe((action: AuthChangeTokenStoreAction) => {
        if (action.token) {
          this.logger.console.debug(
            'AppAuthConfigModule',
            'Token -> Updated !!!',
            action.token
          );
        }
      });

    this.actions$
      .pipe(ofActionDispatched(AuthDoLogoutSuccessfullyStoreAction))
      .subscribe((action: AuthDoLogoutSuccessfullyStoreAction) => {
        if (action.loggedOut) {
          this.logger.console.debug(
            'AppAuthConfigModule',
            'Logged -> Out !!!',
            action.loggedOut
          );

          this.flow.closeAll({}, false).then(() => {
            this.goToLogin();
          });
        }
      });
  }

  private goToDefaultUserPageAfterLogin(): void {
    this.logger.console.debug(
      'AppAuthConfigModule',
      'goToDefaultUserPageAfterLogin'
    );

    let route = this.store.selectSnapshot(
      (state) => state.router?.state?.root?.firstChild
    );

    let child = route;

    while (child) {
      if (child.firstChild) {
        child = child.firstChild;
        route = child;
      } else {
        child = null;
      }
    }

    const routeParams = route.params;

    if (routeParams?.redirect) {
      firstValueFrom(
        this.store.dispatch(new Navigate([routeParams?.redirect]))
      ).then((navigated) => {
        if (!navigated) {
          this.logger.console.debug(
            'AppAuthConfigModule',
            'Navigation to [' + routeParams?.redirect + '] Failed!!!'
          );
          this.goToUserHomePageAfterLogin();
        }
      });
    } else {
      this.goToUserHomePageAfterLogin();
    }
  }

  private goToUserHomePageAfterLogin(): void {
    this.logger.console.debug(
      'AppAuthConfigModule',
      'goToUserHomePageAfterLogin'
    );

    this.flow.startAction('', '', '', null, {}, true).then((navigated) => {
      if (!navigated) {
        this.logger.console.debug(
          'AppAuthConfigModule',
          'Navigation to Home Failed!!!'
        );
      }
    });
  }

  private goToLogin(): void {
    this.logger.console.debug('AppAuthConfigModule', 'goToLogin');

    this.flow.startAction('', '', 'login', null, {}, true).then((navigated) => {
      if (!navigated) {
        this.logger.console.debug(
          'AppAuthConfigModule',
          'Navigation to Login Failed!!!'
        );
      }
    });
  }
}
