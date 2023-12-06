import { Component, inject, OnInit } from '@angular/core';

import { Title } from '@angular/platform-browser';
import { AbstractComponent } from '@ng-techpromux-archetype-project/core-api';
import { LoaderIndicatorStoreState } from '@ng-techpromux-archetype-project/core-ui';
import { Select } from '@ngxs/store';
import { BehaviorSubject, delayWhen, interval, Observable } from 'rxjs';
import { APP_CONFIG_VARS } from './config/config_vars/app-config-vars.config';

@Component({
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>

    <!-- App Loading... -->

    <ng-container *ngIf="showLoader$ | async">
      <div
        id="loader-container"
        class="fade show container-fluid hide-native-scrollbar"
      >
        <div class="row">
          <div id="loader">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="loading"></div>
          </div>
        </div>
      </div>
    </ng-container>

    <!-- App Loading... -->

    <!-- App Notifier... -->

    <notifier-container></notifier-container>

    <!-- App Notifier... -->
  `,
})
export class AppComponent extends AbstractComponent implements OnInit {
  // -----------------------------------------------------
  // PROPERTIES
  // -----------------------------------------------------

  title: string = APP_CONFIG_VARS.APP_NAME;

  // -----------------------------------------------------
  // SERVICES
  // -----------------------------------------------------

  private titleService: Title = inject<Title>(Title);

  // -----------------------------------------------------
  // OBSERVABLES
  // -----------------------------------------------------

  @Select(LoaderIndicatorStoreState.isLoading)
  private isLoading$!: Observable<boolean>;

  protected showLoader$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  // -----------------------------------------------------

  constructor() {
    super();
    this.titleService.setTitle(this.title);
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.logger.console.debug('AppComponent', 'onInit');

    this.addSubscription(
      this.isLoading$
        .pipe(delayWhen((loading) => (loading ? interval(0) : interval(500))))
        .subscribe((loading: boolean) => {
          this.showLoader$.next(loading);
        })
    );
  }
}
