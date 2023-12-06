import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OPTIONS_LISTS_PROVIDER_SERVICE_TOKEN } from '@ng-techpromux-archetype-project/core-service';
import { AppFileUploaderService } from './service/app-file-uploader.service';
import { AppOptionsListsProviderService } from './service/app-options-lists-provider.service';

@NgModule({
  imports: [CommonModule],
  providers: [
    {
      provide: OPTIONS_LISTS_PROVIDER_SERVICE_TOKEN,
      useExisting: AppOptionsListsProviderService,
      multi: true,
    },
    AppOptionsListsProviderService,
    AppFileUploaderService,
  ],
})
export class AppBaseDomainModule {}
