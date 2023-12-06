import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  AvatarModule,
  ButtonGroupModule,
  ButtonModule,
  CalloutModule,
  CardModule,
  DropdownModule,
  FormModule,
  GridModule,
  ListGroupModule,
  NavModule,
  ProgressModule,
  SharedModule,
  TableModule,
  TabsModule,
  UtilitiesModule,
  WidgetModule,
} from '@coreui/angular';

import { ChartjsModule } from '@coreui/angular-chartjs';
import { IconModule } from '@coreui/icons-angular';
import { CoreLayoutBoxesModule } from '@ng-techpromux-archetype-project/core-layout';
import { CoreServiceTranslationModule } from '@ng-techpromux-archetype-project/core-service';
import {
  CoreUiModalModule,
  CoreUiOptionsListsModule,
  CoreUiPhotosGalleryModule,
} from '@ng-techpromux-archetype-project/core-ui';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
  imports: [
    CommonModule,
    // ---------------------------------
    FormsModule,
    ReactiveFormsModule,
    // ---------------------------------
    ButtonModule,
    CardModule,
    IconModule,
    GridModule,
    CalloutModule,
    ProgressModule,
    ButtonGroupModule,
    TabsModule,
    FormModule,
    ListGroupModule,
    ChartjsModule,
    WidgetModule,
    NavModule,
    DropdownModule,
    AvatarModule,
    TableModule,
    UtilitiesModule,
    SharedModule,
    // ---------------------------------
    CoreServiceTranslationModule,
    // ---------------------------------
    CoreLayoutBoxesModule,
    CoreUiModalModule,
    CoreUiPhotosGalleryModule,
    CoreUiOptionsListsModule,
    // ---------------------------------
    BsDatepickerModule,
    // ---------------------------------
  ],
  declarations: [],
  providers: [],
  exports: [
    // ---------------------------------
    FormsModule,
    ReactiveFormsModule,
    // ---------------------------------
    ButtonModule,
    CardModule,
    IconModule,
    GridModule,
    CalloutModule,
    ProgressModule,
    ButtonGroupModule,
    TabsModule,
    FormModule,
    ListGroupModule,
    ChartjsModule,
    WidgetModule,
    NavModule,
    DropdownModule,
    AvatarModule,
    TableModule,
    UtilitiesModule,
    SharedModule,
    // ---------------------------------
    CoreServiceTranslationModule,
    // ---------------------------------
    CoreLayoutBoxesModule,
    CoreUiModalModule,
    CoreUiPhotosGalleryModule,
    CoreUiOptionsListsModule,
    // ---------------------------------
    BsDatepickerModule,
    // ---------------------------------
  ],
})
export class AppBaseUiSharedModule {}
