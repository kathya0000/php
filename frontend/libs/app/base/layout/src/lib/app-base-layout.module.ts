import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import {
  AvatarModule,
  BadgeModule,
  BreadcrumbModule,
  ButtonModule,
  DropdownModule,
  FooterModule,
  GridModule,
  HeaderModule,
  NavModule,
  SidebarModule,
} from '@coreui/angular';

import { IconModule } from '@coreui/icons-angular';
import { CoreLayoutModule } from '@ng-techpromux-archetype-project/core-layout';
import { CoreServiceTranslationModule } from '@ng-techpromux-archetype-project/core-service';
import {
  CoreUiFlowModule,
  CoreUiTranslationModule,
} from '@ng-techpromux-archetype-project/core-ui';
import { FooterComponent } from './component/layout/footer/footer.component';
import { HeaderComponent } from './component/layout/header/header.component';
import { LayoutComponent } from './component/layout/layout.component';
import { QuickLinksComponent } from './component/menu/quick-links/quick-links.component';
import { QuickNotificationsComponent } from './component/menu/quick-notifications/menu-quick-notifications.component';
import { UserDropdownComponent } from './component/menu/user-dropdown/menu-user-dropdown.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    // --------------------------------
    SidebarModule,
    HeaderModule,
    FooterModule,
    GridModule,
    BadgeModule,
    ButtonModule,
    IconModule,
    AvatarModule,
    NavModule,
    BreadcrumbModule,
    DropdownModule,
    // --------------------------------
    CoreLayoutModule,
    CoreUiFlowModule,
    CoreUiTranslationModule,
    CoreServiceTranslationModule,
    // --------------------------------
  ],
  declarations: [
    FooterComponent,
    HeaderComponent,
    LayoutComponent,
    // --------------------------------
    QuickLinksComponent,
    QuickNotificationsComponent,
    UserDropdownComponent,
  ],
  providers: [],
  exports: [LayoutComponent],
})
export class AppBaseLayoutModule {}
