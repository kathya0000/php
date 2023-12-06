import appVersionJson from '../../../app.version.json';
import { environment } from '../../../environments/environment';

export const APP_ENV_CONFIG = {
  envName: environment.name === '' ? 'dev' : environment.name,
  production: environment.production,
  appVersion:
    appVersionJson.version +
    (environment.name === 'prod' ? '' : '-' + environment.name),
};
