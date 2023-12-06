import { CommonModule } from '@angular/common';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import {
  UTIL_CRYPTO_SECRET_KEY_TOKEN,
  UtilCryptoModule,
} from '@ng-techpromux-archetype-project/core-util';
import { APP_CONFIG_VARS } from '../config_vars/app-config-vars.config';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    //-----------------
    UtilCryptoModule,
  ],
  providers: [
    {
      provide: UTIL_CRYPTO_SECRET_KEY_TOKEN,
      useValue: APP_CONFIG_VARS.UTIL_CRYPTO_SECRET_KEY,
    },
  ],
  exports: [],
})
export class AppCryptoConfigModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: AppCryptoConfigModule
  ) {
    if (parentModule) {
      throw new Error(
        'AppCryptoConfigModule is already loaded. Import it in the main config module only.'
      );
    }
  }
}
