import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { AngularFireAuthGuard, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/compat/auth-guard';

const redirectLoggedInToCalendar = () => redirectLoggedInTo(['calendar']);
const redirectNotLoggedInToHome = () => redirectUnauthorizedTo(['']);

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomeModule),
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectLoggedInToCalendar }
  },
  {
    path: 'calendar',
    loadChildren: () =>
      import('./pages/calendar/calendar.module').then((m) => m.CalendarModule),
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectNotLoggedInToHome }
  },
  {
    path: 'sessions',
    loadChildren: () => import('./pages/session/session.module').then((m) => m.SessionModule),
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectNotLoggedInToHome }
  },
  {
    path: 'call',
    loadChildren: () => import('./pages/call/call.module').then((m) => m.CallModule),
    canActivate: [AngularFireAuthGuard]
  },
  {
    path: 'result',
    loadChildren: () => import('./pages/result/result.module').then((m) => m.ResultModule),
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectNotLoggedInToHome }
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then((m) => m.LoginModule),
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectLoggedInToCalendar }
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
