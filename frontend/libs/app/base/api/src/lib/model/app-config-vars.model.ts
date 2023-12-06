export interface IAppConfigVarsModel {
  // ----------------------------------
  // GENERAL
  // ----------------------------------
  APP_NAME: string;
  APP_PACKAGE_NAME: string;
  // ----------------------------------
  // LOGS
  // ----------------------------------
  LOGGER_LEVEL: string;
  LOGGER_SERVER_LEVEL: string;
  // ----------------------------------
  // CRYPTO
  // ----------------------------------
  UTIL_CRYPTO_SECRET_KEY: string;
  // ----------------------------------
  // API
  // ----------------------------------
  API_LARAVEL_BASE_PATH: string;
  // ----------------------------------
  // AUTH
  // ----------------------------------
  AUTH_PROVIDER_LARAVEL9_ENABLED: boolean;
  AUTH_PROVIDER_LARAVEL9_TOKEN_REFRESH_TIME: number;
  // ----------------------------------
}

export interface IAppEnvConfig {
  production: boolean;
  envName: string;
  appVersion: string;
}
