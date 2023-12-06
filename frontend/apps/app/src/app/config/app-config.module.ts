/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { inject, isDevMode, NgModule, Optional, SkipSelf } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AppEnvConfigModule } from './_env/app-env-config.module';
import { AppNavConfigModule } from './nav/app-nav-config.module';
import { AppApiConfigModule } from './api/app-api-config.module';
import { AppAuthConfigModule } from './auth/app-auth-config.module';
import { AppCodeConfigModule } from './code/app-code-config.module';
import { AppCryptoConfigModule } from './crypto/app-crypto-config.module';
import { AppDynamicFormsConfigModule } from './dynamic-forms/app-dynamic-forms-config.module';
import { AppFlowConfigModule } from './flow/app-flow-config.module';
import { AppHttpConfigModule } from './http/app-http-config.module';
import { AppLoaderConfigModule } from './loader/app-loader-config.module';
import { AppLoggerConfigModule } from './logger/app-logger-config.module';
import { AppOptionsListsConfigModule } from './options-lists/app-options-lists-config.module';
import { AppStateConfigModule } from './state/app-state-config.module';
import { AppTranslationConfigModule } from './translation/app-translation-config.module';

import { IconSetService } from '@coreui/icons-angular';
import { Actions, ofActionDispatched, Select, Store } from '@ngxs/store';

import { HttpClientModule } from '@angular/common/http';
import {
  AUTH_MANAGER_SERVICE_TOKEN,
  AuthDoLogoutSuccessfullyStoreAction,
  AuthManagerService,
  AuthStoreState,
} from '@ng-techpromux-archetype-project/core-auth';
import { TranslationStoreState } from '@ng-techpromux-archetype-project/core-service';
import { LoaderIndicatorService } from '@ng-techpromux-archetype-project/core-ui';
import { LoggerService } from '@ng-techpromux-archetype-project/core-util';
import { setTheme } from 'ngx-bootstrap/utils';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppEnvVarsConfigModule } from './config_vars/app-config-vars-config.module';
import { iconsSet } from './icons/app-icon-subset';
import { AppNotifierConfigModule } from './notifier/app-notifier-config.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
    //-----------------
    // Env
    // ----------------
    AppEnvConfigModule,
    // ----------------
    // Env Vars
    // ----------------
    AppEnvVarsConfigModule,
    //-----------------
    // Code
    // ----------------
    AppCodeConfigModule,
    //-----------------
    // Crypto
    // ----------------
    AppCryptoConfigModule,
    //-----------------
    // Logger
    // ----------------
    AppLoggerConfigModule,
    // ----------------
    // Store
    //-----------------
    AppStateConfigModule,
    // ----------------
    // Loader
    // ----------------
    AppLoaderConfigModule,
    // ----------------
    // Notifier
    // ----------------
    AppNotifierConfigModule,
    // ----------------
    // Translation
    // ----------------
    AppTranslationConfigModule,
    // ----------------
    // Api
    // ----------------
    AppApiConfigModule,
    // ----------------
    // Http
    // ----------------
    AppHttpConfigModule,
    // ----------------
    // Auth
    // ----------------
    AppAuthConfigModule,
    // ----------------
    // Flow
    // ----------------
    AppFlowConfigModule,
    // ----------------
    // Navigation
    // ----------------
    AppNavConfigModule,
    // ----------------
    // Options Lists
    // ----------------
    AppOptionsListsConfigModule,
    // ----------------
    // Dynamic Forms
    // ----------------
    AppDynamicFormsConfigModule,
    // ----------------
    // PWA
    // ----------------
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
    // ----------------
  ],
  providers: [],
  exports: [AppNotifierConfigModule],
})
export class AppConfigModule {
  private logger: LoggerService = inject<LoggerService>(LoggerService);

  private iconSetService: IconSetService =
    inject<IconSetService>(IconSetService);

  @Select(TranslationStoreState.getCurrentLanguage)
  private currentLanguage$!: Observable<string>;

  @Select(TranslationStoreState.getTextDirection)
  private currentTextDirection$!: Observable<string>;

  @Select(TranslationStoreState.getTextDirectionInverted)
  private currentTextDirectionInverted$!: Observable<boolean>;

  private store: Store = inject<Store>(Store);

  private auth: AuthManagerService = inject<AuthManagerService>(
    AUTH_MANAGER_SERVICE_TOKEN
  );

  private loader: LoaderIndicatorService =
    inject<LoaderIndicatorService>(LoaderIndicatorService);

  private actions$: Actions = inject<Actions>(Actions);

  constructor(
    @Optional()
    @SkipSelf()
    parentModule: AppConfigModule
  ) {
    if (parentModule) {
      throw new Error(
        'AppConfigModule is already loaded. Import it in the AppModule only.'
      );
    }
    this.init();
  }

  private init(): void {
    this.logger.console.debug('AppConfigModule', 'init');

    // iconSet singleton

    this.iconSetService.icons = { ...iconsSet };

    // bootstrap theme

    setTheme('bs5'); // or 'bs4'

    // text direction

    const html = document.getElementsByTagName('html')[0] as HTMLElement;

    this.currentTextDirection$.subscribe((dir: string) => {
      html.dir = dir;
    });

    this.currentLanguage$.subscribe((lang: string) => {
      html.lang = lang;
    });

    // check token validity

    const checkTokenObs$ = new BehaviorSubject<boolean>(true);
    this.loader.waitFor(
      checkTokenObs$.asObservable(),
      'Check-Valid-Token-Session-' + new Date().getTime()
    );

    const body = document.getElementsByTagName('body')[0] as HTMLElement;
    body.className = (
      body.className
        .replace('session-unchecked', '')
        .replace('session-checked', '') + ' session-unchecked'
    ).trim();

    const isInitialLogged = this.store.selectSnapshot(AuthStoreState.isLogged);

    if (isInitialLogged) {
      this.actions$
        .pipe(ofActionDispatched(AuthDoLogoutSuccessfullyStoreAction))
        .subscribe((action: AuthDoLogoutSuccessfullyStoreAction) => {
          if (action.loggedOut) {
            this.logger.console.debug(
              'AppConfigModule',
              'Logged -> Out !!!',
              action.loggedOut
            );

            setTimeout(() => {
              body.className = (
                body.className
                  .replace('session-unchecked', '')
                  .replace('session-checked', '') + ' session-checked'
              ).trim();
              checkTokenObs$.next(false);
              checkTokenObs$.complete();
              // this.loader.restAll();
            }, 1000);
          }
        });

      this.auth
        .check({
          v: encodeURIComponent(
            btoa(new Date().getTime() + '-' + Math.random())
          ),
        })
        .then((opts) => {
          body.className = (
            body.className
              .replace('session-unchecked', '')
              .replace('session-checked', '') + ' session-checked'
          ).trim();
          checkTokenObs$.next(false);
          checkTokenObs$.complete();
        });
    } else {
      body.className = (
        body.className
          .replace('session-unchecked', '')
          .replace('session-checked', '') + ' session-checked'
      ).trim();
      checkTokenObs$.next(false);
      checkTokenObs$.complete();
    }
  }
}
