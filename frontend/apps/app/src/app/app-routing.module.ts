import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  AppBasePagesFeatureModule,
  LoginComponent,
  LogoutComponent,
  Page404Component,
  Page500Component,
  RegisterComponent,
} from '@apps/app-base-feature';

import {
  AppBaseLayoutModule,
  LayoutComponent,
} from '@apps/app-base-layout';

import {
  CoreAuthGuardModule,
  checkIsAllowed,
} from '@ng-techpromux-archetype-project/core-auth';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./routes/app._home.routing.module').then(
        (m) => m.AppHomeRoutingModule
      ),
    canMatch: [
      () => checkIsAllowed(['IS_ANONYMOUS', 'IS_AUTHENTICATED'], 'or'),
    ],
  },
  {
    path: '',
    component: LayoutComponent,
    data: {
      title: 'Inicio',
    },
    children: [
      //------------------------------------------------------------------
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./routes/app._dashboard.routing.module').then(
            (m) => m.AppDashboardRoutingModule
          ),
        canMatch: [() => checkIsAllowed(['IS_AUTHENTICATED'])],
      },
      //------------------------------------------------------------------
      {
        path: 'projects',
        loadChildren: () =>
          import('./routes/app.projects.routing.module').then(
            (m) => m.AppProjectsRoutingModule
          ),
        canMatch: [() => checkIsAllowed(['IS_AUTHENTICATED'])],
      },
      //------------------------------------------------------------------
    ],
  },
  {
    path: '404',
    component: Page404Component,
    data: {
      title: 'Page 404',
      flowData: {
        context: '',
        module: '',
        action: '404',
        step: '',
      },
    },
  },
  {
    path: '500',
    component: Page500Component,
    data: {
      title: 'Page 500',
      flowData: {
        context: '',
        module: '',
        action: '500',
        step: '',
      },
    },
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: {
      title: 'Register Page',
      flowData: {
        context: '',
        module: '',
        action: 'register',
        step: '',
      },
    },
    canActivate: [() => checkIsAllowed(['IS_ANONYMOUS'])],
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page',
      flowData: {
        context: '',
        module: '',
        action: 'login',
        step: '',
      },
    },
    canActivate: [() => checkIsAllowed(['IS_ANONYMOUS'])],
  },
  {
    path: 'logout',
    component: LogoutComponent,
    data: {
      title: 'Logout Page',
      flowData: {
        context: '',
        module: '',
        action: 'logout',
        step: '',
      },
    },
    canActivate: [() => checkIsAllowed(['ROLE_USER'])],
  },
  { path: '**', redirectTo: '404' },
];

@NgModule({
  imports: [
    BrowserAnimationsModule,
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
      anchorScrolling: 'enabled',
      initialNavigation: 'enabledBlocking',
      onSameUrlNavigation: 'reload',
      // relativeLinkResolution: 'legacy'
    }),
    CoreAuthGuardModule,
    AppBaseLayoutModule,
    AppBasePagesFeatureModule,
  ],
  declarations: [],
  exports: [RouterModule],
})
export class AppRoutingModule {}
