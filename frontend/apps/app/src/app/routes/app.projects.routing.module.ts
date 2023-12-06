import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  AddComponent,
  AppProjectsFeatureModule,
  EditComponent,
  ListComponent,
} from '@apps/app-projects-feature';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
  {
    path: 'list',
    component: ListComponent,
    data: {
      title: $localize`Listado Obras`,
      enabled: true,
      flowData: {
        context: '',
        module: 'projects',
        action: 'list',
        step: '',
      },
      animation: 'ProjectListPage',
    },
    /*canActivate: [() => checkIsAllowed(['ROLE_USER'])],*/
  },
  {
    path: 'add/:step',
    component: AddComponent,
    data: {
      title: $localize`Añadir Obra`,
      enabled: true,
      flowData: {
        context: '',
        module: 'projects',
        action: 'add',
        step: 'step1',
        steps: ['step1', 'step2', 'step3'],
      },
      animation: 'ProjectAddPage',
    },
    /*canActivate: [() => checkIsAllowed(['ROLE_USER'])],*/
  },
  {
    path: 'edit/:step',
    component: EditComponent,
    data: {
      title: $localize`Editar Obra`,
      enabled: true,
      flowData: {
        context: '',
        module: 'projects',
        action: 'edit',
        step: 'step1',
        steps: ['step1', 'step2', 'step3'],
      },
      animation: 'ProjectEditPage',
    },
    /*canActivate: [() => checkIsAllowed(['ROLE_USER'])],*/
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), AppProjectsFeatureModule],
  exports: [RouterModule],
})
export class AppProjectsRoutingModule {}
