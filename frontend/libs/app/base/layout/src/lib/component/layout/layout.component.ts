/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { INavData } from '@coreui/angular';
import { Select } from '@ngxs/store';
import { AbstractComponent } from '@ng-techpromux-archetype-project/core-api';
import { MenuStoreState } from '@ng-techpromux-archetype-project/core-ui';
import { Observable } from 'rxjs';

// navItems = [];

@Component({
  templateUrl: './layout.component.html',
})
export class LayoutComponent extends AbstractComponent implements OnInit {
  // ---------------------------------------------------------------------

  @Select(MenuStoreState.getMenuItemsSelector('layout-sidebar-main-items'))
  protected mainNavItems$!: Observable<INavData[]>;

  @Select(MenuStoreState.getMenuItemsSelector('layout-sidebar-footer-items'))
  protected footerNavItems$!: Observable<INavData[]>;

  // ---------------------------------------------------------------------

  theme: 'light' | 'dark' = 'light'; // dark

  // ---------------------------------------------------------------------

  constructor() {
    super();
    //
  }

  override ngOnInit(): void {
    super.ngOnInit();
  }
}
