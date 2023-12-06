/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { IAppConfigVarsModel } from '@apps/app-base-api';
import { DotEnvVarsParserService } from '@ng-techpromux-archetype-project/core-util';
import { environment } from '../../../environments/environment';

const dotEnvVarsToken = process.env['NX_APP_ENV_VARS_TOKEN'];

export const APP_CONFIG_VARS: IAppConfigVarsModel =
  DotEnvVarsParserService.getVars<IAppConfigVarsModel>(
    dotEnvVarsToken as string,
    'app',
    environment.name === '' ? 'dev' : environment.name
  );
