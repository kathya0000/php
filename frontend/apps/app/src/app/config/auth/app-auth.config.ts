import { APP_API_CONFIG } from '../api/app-api.config';
import { APP_CONFIG_VARS } from '../config_vars/app-config-vars.config';

export const APP_AUTH_CONFIG = {
  providers: {
    LARAVEL9: {
      enabled: APP_CONFIG_VARS.AUTH_PROVIDER_LARAVEL9_ENABLED,
      config: {
        base_path: APP_API_CONFIG.laravel9_api_base_path,
        token_refresh_time:
          APP_CONFIG_VARS.AUTH_PROVIDER_LARAVEL9_TOKEN_REFRESH_TIME,
      },
    },
  },
};
