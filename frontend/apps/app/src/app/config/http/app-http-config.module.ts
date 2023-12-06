/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import {
  HTTP_INTERCEPTOR_APIS_PREFIXES_CONFIG_TOKEN,
  HttpRequestAppendHeadersToApiCallInterceptor,
  HttpResponseInternalServerErrorInterceptor,
} from '@ng-techpromux-archetype-project/core-service';
import { APP_API_CONFIG } from '../api/app-api.config';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    // ----------------
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTOR_APIS_PREFIXES_CONFIG_TOKEN,
      useValue: [
        APP_API_CONFIG.laravel9_api_base_path,
      ],
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpRequestAppendHeadersToApiCallInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpResponseInternalServerErrorInterceptor,
      multi: true,
    },
  ],
  exports: [
    //
  ],
})
export class AppHttpConfigModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: AppHttpConfigModule
  ) {
    if (parentModule) {
      throw new Error(
        'AppHttpConfigModule is already loaded. Import it in the main config module only.'
      );
    }

    this.init();
  }

  private init(): void {
    //
  }
}
