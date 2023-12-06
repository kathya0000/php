import { APP_CONFIG_VARS } from '../config_vars/app-config-vars.config';

export const APP_API_CONFIG = {
  laravel9_api_base_path:
    APP_CONFIG_VARS.API_LARAVEL_BASE_PATH || window.location.origin,
  laravel9_api_image_store_base_path:
    APP_CONFIG_VARS.API_LARAVEL_BASE_PATH || window.location.origin,
};
