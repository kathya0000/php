import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppBaseUiSharedModule } from '@apps/app-base-ui';
import { ButtonModule, CardModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { NgSelectModule } from '@ng-select/ng-select';
import {
  CoreUiDatatableModule,
  CoreUiDynamicFormsModule,
} from '@ng-techpromux-archetype-project/core-ui';
import { TranslatePipe } from '@ngx-translate/core';
import { GeneralFormComponent } from './component/general-form/general-form.component';
import { ModuleItemFormComponent } from './component/module-item-form/module-item-form.component';
import { ProjectDetailComponent } from './component/project-detail/project-detail.component';
import { ProjectsTableSettingsHandler } from './component/projects-table/projects-table-settings.handler';
import { ProjectsTableComponent } from './component/projects-table/projects-table.component';
import { SpaceFormComponent } from './component/space-form/space-form.component';
import { AddressPipe } from './pipe/address.pipe';
import { BudgetPipe } from './pipe/budget.pipe';
import { CreatedAtPipe } from './pipe/created-at.pipe';
import { RatingPipe } from './pipe/rating.pipe';
import { ThumbnailPipe } from './pipe/thumbnail.pipe';
import { UpdatedAtPipe } from './pipe/updated-at.pipe';

@NgModule({
  imports: [
    CommonModule,
    AppBaseUiSharedModule,
    CoreUiDatatableModule,
    CoreUiDynamicFormsModule,
    NgSelectModule,
    FormsModule,
    CardModule,
    IconModule,
    ButtonModule,
  ],
  declarations: [
    // ----------------------------------------------
    ProjectsTableComponent,
    ProjectDetailComponent,
    // ----------------------------------------------
    GeneralFormComponent,
    SpaceFormComponent,
    ModuleItemFormComponent,
    // ----------------------------------------------
    AddressPipe,
    BudgetPipe,
    CreatedAtPipe,
    UpdatedAtPipe,
    RatingPipe,
    ThumbnailPipe,
    // ----------------------------------------------
  ],
  providers: [
    // ----------------------------------------------
    ProjectsTableSettingsHandler,
    // ----------------------------------------------
    AddressPipe,
    BudgetPipe,
    CreatedAtPipe,
    UpdatedAtPipe,
    RatingPipe,
    ThumbnailPipe,
    // ----------------------------------------------
    DatePipe,
    TranslatePipe,
    // I18nDatePipe,
    CurrencyPipe,
    // ----------------------------------------------
  ],
  exports: [
    // ----------------------------------------------
    ProjectsTableComponent,
    ProjectDetailComponent,
    // ----------------------------------------------
    GeneralFormComponent,
    SpaceFormComponent,
    // ----------------------------------------------
  ],
})
export class AppProjectsUiModule {}
