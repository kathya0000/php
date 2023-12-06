/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { marker as _i18n } from '@biesbjerg/ngx-translate-extract-marker';
import {
  AUTH_MANAGER_SERVICE_TOKEN,
  AUTH_PROVIDER_SERVICE_TOKEN,
  AuthManagerService,
  AuthProviderService,
  AuthStoreState,
} from '@ng-techpromux-archetype-project/core-auth';
import { AbstractFeatureComponent } from '@ng-techpromux-archetype-project/core-ddd';
import { Store } from '@ngxs/store';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent
  extends AbstractFeatureComponent
  implements OnInit, OnDestroy
{
  // ----------------------------------------------------------------

  private auth: AuthManagerService = inject<AuthManagerService>(
    AUTH_MANAGER_SERVICE_TOKEN
  );

  private providers: AuthProviderService[] = inject<AuthProviderService[]>(
    AUTH_PROVIDER_SERVICE_TOKEN
  );

  private store: Store = inject<Store>(Store);

  private fb: FormBuilder = inject<FormBuilder>(FormBuilder);

  // ----------------------------------------------------------------

  public form: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(3)]],
    rememberme: [false, []],
  });

  // ----------------------------------------------------------------

  providersConfig = [
    {
      id: 'LARAVEL9',
      enabled: true,
      color: 'success',
      icon: 'cib-laravel',
      title: _i18n('base.login.provider.LARAVEL9.title'),
    },
    {
      id: 'SUITECRM7',
      enabled: false,
      color: 'info',
      icon: 'cil3d',
      title: _i18n('base.login.provider.SUITECRM7.title'),
    },
    {
      id: 'OAUTH2_SOCIAL_GOOGLE',
      enabled: false,
      color: 'danger',
      icon: 'cib-google',
      title: _i18n('base.login.provider.OAUTH2_SOCIAL_GOOGLE.title'),
    },
    {
      id: 'OAUTH2_SOCIAL_FACEBOOK',
      enabled: false,
      color: 'primary',
      icon: 'cib-facebook',
      title: _i18n('base.login.provider.OAUTH2_SOCIAL_FACEBOOK.title'),
    },
    {
      id: 'OAUTH2_KEYCLOAK',
      enabled: false,
      color: 'warning',
      icon: 'cil-lock-locked',
      title: _i18n('base.login.provider.OAUTH2_KEYCLOAK.title'),
    },
    {
      id: 'MOCKED_USER_DATA',
      enabled: false,
      color: 'secondary',
      icon: 'cil-puzzle',
      title: _i18n('base.login.provider.MOCKED_USER_DATA.title'),
    },
  ];

  activeProviderId = '';

  showProvidersOptions = false;

  // ----------------------------------------------------------------

  override ngOnInit(): void {
    super.ngOnInit();

    let providersEnabledCount = 0;

    this.providersConfig.forEach((pConfig) => {
      this.providers.forEach((prov) => {
        if (pConfig.id === prov.getProviderKey() && prov.isEnabled()) {
          pConfig.enabled = true;
        }
      });
      if (pConfig.enabled) {
        providersEnabledCount++;
      }
    });

    this.showProvidersOptions = providersEnabledCount > 1;

    const defaultProviderId: string | null = this.store.selectSnapshot(
      AuthStoreState.getProviderId
    );

    if (defaultProviderId) {
      this.activeProviderId = defaultProviderId;
    } else {
      const enabledProvides = this.providersConfig.filter(
        (prov) => prov.enabled
      );
      if (enabledProvides.length > 0) {
        this.activeAsDefault(enabledProvides[0].id);
      }
    }
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  // ---------------------------------------

  isActive(key: string = ''): boolean {
    return this.activeProviderId === key;
  }

  activeAsDefault(key: string = ''): void {
    this.auth.configureAsDefault(key, null).then((result) => {
      // this.logger.console.debug(this.__classname, 'auth -> configured ok', key, result);
      this.activeProviderId = key;
    });
  }

  // ---------------------------------------

  public login(): void {
    const defaultProvider: string | null = this.store.selectSnapshot(
      AuthStoreState.getProviderId
    );

    let loginData: any = {};
    if (!this.form.valid) {
      return;
    }
    loginData = {
      username: this.form.get('username')?.value,
      password: this.form.get('password')?.value,
      remember_me: this.form.get('rememberme')?.value,
    };
    this.loginWidthDefault(loginData);
  }

  // ---------------------------------------

  private loginWidthDefault(data: any = {}): void {
    this.startLoader('loginWidthDefault');

    this.auth
      .login(data)
      .then((result) => {
        this.endLoader('loginWidthDefault');
        if (result) {
          // this.logger.console.debug(this.__classname, 'auth -> login OK', result);
          setTimeout(() => {
            this.auth.dispatchLoginSuccessfully();
          }, 100);
        } else {
          // this.logger.console.debug(this.__classname, 'auth -> login NOT OK', result);
        }
      })
      .catch((e) => {
        this.endLoader('loginWidthDefault');
        // this.logger.console.debug(this.__classname, 'auth -> login error', e);
        this.logger.console.error(e);
      });
  }

  // ---------------------------------------
}
