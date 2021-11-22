import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { AngularFireAuthGuard, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/compat/auth-guard';

const redirectLoggedInToCalendar = () => redirectLoggedInTo(['calendar']);
const redirectNotLoggedIn = () => redirectUnauthorizedTo(['login']);

const routes: Routes = [
  { path: '', redirectTo: 'calendar', pathMatch: 'full' },
  {
    path: 'calendar',
    loadChildren: () =>
      import('./pages/calendar/calendar.module').then((m) => m.CalendarModule),
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectNotLoggedIn }
  },
  {
    path: 'sessions',
    loadChildren: () => import('./pages/session/session.module').then((m) => m.SessionModule),
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectNotLoggedIn }
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
    data: { authGuardPipe: redirectNotLoggedIn }
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
