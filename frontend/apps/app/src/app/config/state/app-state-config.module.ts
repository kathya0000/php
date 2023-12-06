/* eslint-disable @typescript-eslint/no-explicit-any */

import { CommonModule } from '@angular/common';
import {
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf,
  isDevMode,
} from '@angular/core';

import { NgxsSelectSnapshotModule } from '@ngxs-labs/select-snapshot';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import {
  NavigationActionTiming,
  NgxsRouterPluginModule,
} from '@ngxs/router-plugin';
import { NgxsStoragePluginModule, STORAGE_ENGINE } from '@ngxs/storage-plugin';
import { NgxsModule, getActionTypeFromInstance } from '@ngxs/store';

import {
  UTIL_STORE_LOCAL_STORAGE_PREFIX_KEY_TOKEN,
  UTIL_STORE_LOCAL_STORAGE_USE_CRYPTO_FOR_KEYS_TOKEN,
  UTIL_STORE_LOCAL_STORAGE_USE_CRYPTO_FOR_VALUES_TOKEN,
  UtilCryptoModule,
  UtilStorageLocalModule,
  UtilStorageLocalService,
} from '@ng-techpromux-archetype-project/core-util';
import { APP_CONFIG_VARS } from '../config_vars/app-config-vars.config';
import {
  APP_STATE_ALL_CONFIG,
  APP_STATE_KEYS_TO_STORAGE_CONFIG,
} from './app-state.config';

const pluginModulesForDevMode: ModuleWithProviders<any>[] = [];

if (isDevMode()) {
  pluginModulesForDevMode.push(
    NgxsReduxDevtoolsPluginModule.forRoot({
      disabled: !isDevMode(),
    })
  );

  pluginModulesForDevMode.push(
    NgxsLoggerPluginModule.forRoot({
      disabled: !isDevMode(),
      collapsed: true,
      filter: (action) => {
        const actionName: string | undefined =
          getActionTypeFromInstance(action);
        return actionName
          ? actionName !== null &&
              /* actionName.indexOf('@@INIT') === -1 && */
              /* actionName.indexOf('@@UPDATE_STATE') === -1 && */
              actionName.indexOf('[TRANSLATION]') === -1 &&
              actionName.indexOf('[LOADING]') === -1 &&
              actionName.indexOf('[AUTH]') === -1 &&
              actionName.indexOf('[FLOW]') === -1 &&
              actionName.indexOf('[MENU]') === -1 &&
              actionName.indexOf('[OPTIONS]') === -1 &&
              actionName.indexOf('[LAYOUT]') === -1 &&
              actionName.indexOf('[Router]') === -1
          : true;
      },
    })
  );
}

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    //-----------------
    // App State
    //-----------------
    NgxsModule.forRoot([...APP_STATE_ALL_CONFIG], {
      developmentMode: isDevMode(),
    }),
    // ---------------------------
    NgxsStoragePluginModule.forRoot({
      key: [...APP_STATE_KEYS_TO_STORAGE_CONFIG],
      // deserialize: JSON.parse,
      // serialize: JSON.stringify
    }),
    // ---------------------------
    NgxsRouterPluginModule.forRoot({
      navigationActionTiming: NavigationActionTiming.PostActivation,
    }),
    // ---------------------------
    NgxsSelectSnapshotModule.forRoot(),
    // ---------------------------
    ...pluginModulesForDevMode,
    // ---------------------------
    UtilCryptoModule,
    // ---------------------------
    UtilStorageLocalModule,
    // ---------------------------
  ],
  providers: [
    {
      provide: UTIL_STORE_LOCAL_STORAGE_PREFIX_KEY_TOKEN,
      useValue: APP_CONFIG_VARS.APP_PACKAGE_NAME,
    },
    {
      provide: UTIL_STORE_LOCAL_STORAGE_USE_CRYPTO_FOR_KEYS_TOKEN,
      useValue: !isDevMode(),
    },
    {
      provide: UTIL_STORE_LOCAL_STORAGE_USE_CRYPTO_FOR_VALUES_TOKEN,
      useValue: !isDevMode(),
    },
    {
      provide: STORAGE_ENGINE,
      useExisting: UtilStorageLocalService,
    },
  ],
  exports: [],
})
export class AppStateConfigModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: AppStateConfigModule
  ) {
    if (parentModule) {
      throw new Error(
        'AppStateConfigModule is already loaded. Import it in the main config module only.'
      );
    }
  }
}
