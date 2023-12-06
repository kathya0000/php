/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { inject, NgModule, Optional, SkipSelf } from '@angular/core';

import { Store } from '@ngxs/store';
import {
  AUTH_MANAGER_SERVICE_TOKEN,
  AuthManagerService,
  AuthStoreState,
} from '@ng-techpromux-archetype-project/core-auth';
import {
  CoreUiMenuModule,
  INavDataWithExtraOptions,
  MenuService,
} from '@ng-techpromux-archetype-project/core-ui';
import { LoggerService } from '@ng-techpromux-archetype-project/core-util';
import { APP_NAV_CONFIG } from './app-nav.config';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    // ----------------
    CoreUiMenuModule,
    // ----------------
  ],
  providers: [],
  exports: [],
})
export class AppNavConfigModule {
  // --------------------------------------------------------------
  // SERVICES
  // --------------------------------------------------------------

  private logger: LoggerService = inject<LoggerService>(LoggerService);

  private store: Store = inject<Store>(Store);

  private menu: MenuService =
    inject<MenuService>(MenuService);

  private auth: AuthManagerService = inject<AuthManagerService>(
    AUTH_MANAGER_SERVICE_TOKEN
  );

  constructor(
    @Optional()
    @SkipSelf()
    parentModule: AppNavConfigModule
  ) {
    if (parentModule) {
      throw new Error(
        'AppNavConfigModule is already loaded. Import it in the main config module only.'
      );
    }
    this.init();
  }

  private init(): void {
    this.logger.console.debug('AppNavConfigModule', 'init');
    // --------------------------------------------------------------
    // Sidebar Nav Items
    // --------------------------------------------------------------

    const mainNavItems = APP_NAV_CONFIG.sidebar.main;

    this.menu.addMenuOptions('layout-sidebar-main-items', mainNavItems);

    const footerNavItems = APP_NAV_CONFIG.sidebar.footer;

    this.menu.addMenuOptions('layout-sidebar-footer-items', footerNavItems);

    // --------------------------------------------------------------
    // User Dropdown Options
    // --------------------------------------------------------------

    const userDropdownNavItems = APP_NAV_CONFIG.user.dropdown;

    this.menu.addMenuOptions(
      'layout-user-dropdown-items',
      userDropdownNavItems
    );

    // --------------------------------------------------------------
    // Languages Chooser Options
    // --------------------------------------------------------------

    const languages = APP_NAV_CONFIG.lang.available;

    this.menu.addMenuOptions('language-available-options', languages);

    // --------------------------------------------------------------

    // --------------------------------------------------------------
    // Filter Menu Items By Some Logic
    // --------------------------------------------------------------

    // this.filterNavItemsByAuthenticationLogic();

    // --------------------------------------------------------------
  }

  private filterNavItemsByAuthenticationLogic() {
    this.store.select(AuthStoreState.isLogged).subscribe((logged: boolean) => {
      // const filteredSidebarNavItems: any[] = [];
      // this.menu.addMenuOptions('sidebar-nav-items', filteredSidebarNavItems);
    });
  }

  private getFilteredMenuItemsByLogged(
    navItems: INavDataWithExtraOptions[],
    logged: boolean
  ): INavDataWithExtraOptions[] {
    return navItems
      .filter((item) => item !== null)
      .filter((item) =>
        this.auth.hasPermissions(
          item.extraOptions?.auth?.requiredRoles
            ? item.extraOptions?.auth?.requiredRoles
            : [],
          item.extraOptions?.auth?.requiredRolesOperator
            ? item.extraOptions?.auth?.requiredRolesOperator
            : 'and'
        )
      );
  }
}
