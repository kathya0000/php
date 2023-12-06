import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

import { AppBaseCoreModule } from '@apps/app-base-api';
import { CoreUiNotificationModule } from '@ng-techpromux-archetype-project/core-ui';
import { AppConfigModule } from './config/app-config.module';

@NgModule({
  declarations: [
    // ---------------------------------
    AppComponent,
    // ---------------------------------
  ],
  imports: [
    // ---------------------------------
    BrowserModule,
    BrowserAnimationsModule,
    // --------------------------------
    AppConfigModule,
    // --------------------------------
    AppBaseCoreModule,
    // --------------------------------
    AppRoutingModule,
    // --------------------------------
    CoreUiNotificationModule,
    // --------------------------------
  ],
  providers: [
    // ---------------------------------
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy,
    },
    // ---------------------------------

    Title,
    // ---------------------------------
  ],
  bootstrap: [
    // ---------------------------------
    AppComponent,
    // ---------------------------------
  ],
})
export class AppModule {}
