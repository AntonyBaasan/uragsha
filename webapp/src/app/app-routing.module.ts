import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { AngularFireAuthGuard, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/compat/auth-guard';

const redirectLoggedInToAccount = () => redirectLoggedInTo(['']);

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'calendar',
    loadChildren: () =>
      import('./pages/calendar/calendar.module').then((m) => m.CalendarModule),
  },
  {
    path: 'sessions',
    loadChildren: () => import('./pages/session/session.module').then((m) => m.SessionModule),
    canActivate: [AngularFireAuthGuard]
  },
  {
    path: 'call',
    loadChildren: () => import('./pages/call/call.module').then((m) => m.CallModule),
    canActivate: [AngularFireAuthGuard]
  },
  {
    path: 'result',
    loadChildren: () => import('./pages/result/result.module').then((m) => m.ResultModule),
    canActivate: [AngularFireAuthGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then((m) => m.LoginModule),
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectLoggedInToAccount }
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      relativeLinkResolution: 'corrected',
      // enableTracing: true
      useHash: true
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
