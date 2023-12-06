import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  AppBaseHomeFeatureModule,
  HomeComponent,
} from '@apps/app-base-feature';
// import { checkIsAllowed } from '@ng-techpromux-archetype-project/core-auth';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: {
      title: $localize`Home`,
      enabled: true,
      flowData: {
        context: '',
        module: '',
        action: '',
        step: '',
      },
      animation: 'HomePage',
    },
    // canActivate: [() => checkIsAllowed([])],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), AppBaseHomeFeatureModule],
  exports: [RouterModule],
})
export class AppHomeRoutingModule {}
