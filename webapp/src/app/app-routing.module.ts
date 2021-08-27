import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { AngularFireAuthGuard } from '@angular/fire/compat/auth-guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'call',
    loadChildren: () => import('./call/call.module').then((m) => m.CallModule),
    canActivate: [AngularFireAuthGuard]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      relativeLinkResolution: 'corrected',
      // enableTracing: true
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
