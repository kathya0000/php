import {
  CommonModule,
  registerLocaleData as ngRegisterLocaleData,
} from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import ngLocaleAr from '@angular/common/locales/ar';
import ngLocaleEn from '@angular/common/locales/en';
import ngLocaleEs from '@angular/common/locales/es';
import {
  LOCALE_ID,
  NgModule,
  Optional,
  SkipSelf,
  StaticClassProvider,
  inject,
} from '@angular/core';
import {
  CoreServiceTranslationModule,
  TRANSLATION_AVAILABLE_LANGUAGES_TOKEN,
  TranslationService,
  TranslationStoreState,
} from '@ng-techpromux-archetype-project/core-service';

import {
  MissingTranslationHandler,
  MissingTranslationHandlerParams,
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Select } from '@ngxs/store';
import { defineLocale as bsDefineLocale } from 'ngx-bootstrap/chronos';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import {
  arLocale as bsLocaleAr,
  enGbLocale as bsLocaleEn,
  esLocale as bsLocaleEs,
} from 'ngx-bootstrap/locale';
import { Observable } from 'rxjs';
import { APP_ENV_CONFIG } from '../_env/app-env.config';
import { APP_TRANSLATION_CONFIG } from './app-translation.config';

ngRegisterLocaleData(ngLocaleEn, 'en');
ngRegisterLocaleData(ngLocaleEs, 'es');
ngRegisterLocaleData(ngLocaleAr, 'ar');

bsDefineLocale('en-gb', bsLocaleEn);
bsDefineLocale('es-es', bsLocaleEs);
bsDefineLocale('ar-ar', bsLocaleAr);

class CustomMissingTranslationHandler implements MissingTranslationHandler {
  constructor() {
    //
  }
  handle(params: MissingTranslationHandlerParams) {
    return `MISSING_TRANSLATION: [${params.key}]`;
  }
}

export class DynamicLocaleId extends String {
  constructor(protected service: TranslateService) {
    super('');
  }

  public override toString(): string {
    return this.service.currentLang ? this.service.currentLang : 'en';
  }
}

export const LocaleProvider: StaticClassProvider = {
  provide: LOCALE_ID,
  useClass: DynamicLocaleId,
  deps: [TranslateService],
};

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
    // ----------------
    TranslateModule.forRoot({
      defaultLanguage: 'es',
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => {
          return new TranslateHttpLoader(
            http,
            './assets/i18n/',
            '.json?v=' + encodeURIComponent(btoa(APP_ENV_CONFIG.appVersion))
          );
        },
        deps: [HttpClient],
      },
      missingTranslationHandler: {
        provide: MissingTranslationHandler,
        useClass: CustomMissingTranslationHandler,
        deps: [],
      },
    }),
    // ----------------
    CoreServiceTranslationModule,
  ],
  providers: [
    LocaleProvider,
    {
      provide: TRANSLATION_AVAILABLE_LANGUAGES_TOKEN,
      useValue: APP_TRANSLATION_CONFIG.languages,
    },
  ],
  exports: [TranslateModule],
})
export class AppTranslationConfigModule {
  private translation: TranslationService =
    inject<TranslationService>(TranslationService);

  private bsLocaleService: BsLocaleService =
    inject<BsLocaleService>(BsLocaleService);

  @Select(TranslationStoreState.getCurrentLanguage)
  private currentLanguage$!: Observable<string>;

  constructor(
    @Optional()
    @SkipSelf()
    parentModule: AppTranslationConfigModule
  ) {
    if (parentModule) {
      throw new Error(
        'AppTranslationConfigModule is already loaded. Import it in the main config module only.'
      );
    }

    this.init();
  }

  private init(): void {
    this.translation.init('es', 'es');

    this.currentLanguage$.subscribe((currentLang) => {
      switch (currentLang) {
        case 'en':
          this.bsLocaleService.use('en-gb');
          break;
        case 'es':
          this.bsLocaleService.use('es-es');
          break;
        case 'ar':
          this.bsLocaleService.use('ar-ar');
          break;
        default:
          break;
      }
    });
  }
}
