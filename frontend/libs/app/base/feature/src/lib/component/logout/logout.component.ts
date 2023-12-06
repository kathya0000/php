/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  AUTH_MANAGER_SERVICE_TOKEN,
  AuthManagerService,
} from '@ng-techpromux-archetype-project/core-auth';
import { AbstractFeatureComponent } from '@ng-techpromux-archetype-project/core-ddd';

@Component({
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
})
export class LogoutComponent
  extends AbstractFeatureComponent
  implements OnInit, OnDestroy
{
  private auth: AuthManagerService = inject<AuthManagerService>(
    AUTH_MANAGER_SERVICE_TOKEN
  );

  override ngOnInit(): void {
    super.ngOnInit();
    this.startLoader();
    this.auth
      .logout({})
      .then((result) => {
        // this.logger.console.debug(this.__classname, 'auth -> logout ok', result);
        setTimeout(() => {
          this.endLoader();
          this.auth.dispatchLogoutSuccessfully();
        }, 100);
      })
      .catch((e) => {
        // this.logger.console.debug(this.__classname, 'auth -> logout error', e);
        this.logger.console.error(e);
      });
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
