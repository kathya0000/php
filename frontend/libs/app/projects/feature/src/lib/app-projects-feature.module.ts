import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  ButtonModule,
  CardModule,
  NavModule,
  TabsModule,
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { AppBaseUiSharedModule } from '@apps/app-base-ui';
import { AppProjectsDomainModule } from '@apps/app-projects-domain';
import { AppProjectsUiModule } from '@apps/app-projects-ui';
import { AddComponent } from './component/add/add.component';
import { EditComponent } from './component/edit/edit.component';
import { ListComponent } from './component/list/list.component';

@NgModule({
  imports: [
    CommonModule,
    AppBaseUiSharedModule,
    AppProjectsDomainModule,
    AppProjectsUiModule,
    CardModule,
    TabsModule,
    NavModule,
    IconModule,
    ButtonModule,
  ],
  declarations: [ListComponent, EditComponent, AddComponent],
  exports: [ListComponent, EditComponent, AddComponent],
})
export class AppProjectsFeatureModule {}
