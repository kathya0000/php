/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { AuthStoreState } from '@ng-techpromux-archetype-project/core-auth';
import { AbstractFeatureComponent } from '@ng-techpromux-archetype-project/core-ddd';
import { FlowService } from '@ng-techpromux-archetype-project/core-service';

@Component({
  template: '',
})
export class HomeComponent
  extends AbstractFeatureComponent
  implements OnInit, OnDestroy
{
  // ----------------------------------------------------------
  // SERVICES
  // ----------------------------------------------------------

  private store: Store = inject<Store>(Store);

  private flow: FlowService =
    inject<FlowService>(FlowService);

  // ----------------------------------------------------------
  // PROPERTIES
  // ----------------------------------------------------------

  // -----------------------------------------------------
  // OBSERVABLES
  // -----------------------------------------------------

  // -----------------------------------------------------

  constructor() {
    super();
  }

  override ngOnInit(): void {
    super.ngOnInit();

    const isLogged = this.store.selectSnapshot(AuthStoreState.isLogged);

    if (isLogged) {
      this.flow.startAction('', 'dashboard', '', null, {}, true).then();
      return;
    }

    this.flow
      .startAction('', '', 'login', null, { redirect: '/dashboard' }, true)
      .then();
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  // ---------------------------------------------------------
}
