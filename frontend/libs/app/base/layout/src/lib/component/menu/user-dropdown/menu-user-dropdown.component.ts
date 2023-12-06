import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { INavData } from '@coreui/angular';
import { Select } from '@ngxs/store';
import { AbstractComponent } from '@ng-techpromux-archetype-project/core-api';
import {
  AuthStoreState,
  AuthUserStoreModel,
} from '@ng-techpromux-archetype-project/core-auth';
import { MenuStoreState } from '@ng-techpromux-archetype-project/core-ui';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-layout-menu-user-dropdown',
  templateUrl: './menu-user-dropdown.component.html',
  styleUrls: ['./menu-user-dropdown.component.scss'],
})
export class UserDropdownComponent
  extends AbstractComponent
  implements OnInit
{
  // -----------------------------------------------------
  // OBSERVABLES
  // -----------------------------------------------------

  @Select(AuthStoreState.isLogged)
  protected isUserLogged$!: Observable<boolean>;

  @Select(AuthStoreState.getUserData)
  protected userData$!: Observable<AuthUserStoreModel>;

  // -----------------------------------------------------

  @Select(MenuStoreState.getMenuItemsSelector('layout-user-dropdown-items'))
  private userNavItems$!: Observable<INavData[]>;

  // -----------------------------------------------------

  userNavItems: INavData[] = [];

  // -----------------------------------------------------
  // SERVICES
  // -----------------------------------------------------

  // private flow!: FlowService;

  private router: Router = inject<Router>(Router);

  // -----------------------------------------------------

  constructor() {
    super();
  }

  override ngOnInit(): void {
    super.ngOnInit();

    this.addSubscription(
      this.userNavItems$.subscribe((data) => {
        this.userNavItems = data;
      })
    );
  }
}
