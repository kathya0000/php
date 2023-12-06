import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  AppBaseDashboardFeatureModule,
  DashboardComponent,
} from '@apps/app-base-feature';
// import { checkIsAllowed } from '@ng-techpromux-archetype-project/core-auth';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    data: {
      title: $localize`Dashboard`,
      enabled: true,
      flowData: {
        context: '',
        module: 'dashboard',
        action: '',
        step: '',
      },
      animation: 'DashboardPage',
    },
    // canActivate: [() => checkIsAllowed(['ROLE_USER'])],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), AppBaseDashboardFeatureModule],
  exports: [RouterModule],
})
export class AppDashboardRoutingModule {}
