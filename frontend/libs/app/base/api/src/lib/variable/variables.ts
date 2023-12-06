import { InjectionToken } from '@angular/core';

import {
  IAppConfigVarsModel,
  IAppEnvConfig,
} from '../model/app-config-vars.model';

export const APP_ENV_TOKEN = new InjectionToken<IAppEnvConfig>('APP_ENV_TOKEN');

export const APP_CONFIG_VARS_TOKEN = new InjectionToken<IAppConfigVarsModel>(
  'APP_CONFIG_VARS_TOKEN'
);

export const APP_CONFIG_FORMS_VALIDATORS = [];
