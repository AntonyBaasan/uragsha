import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarTabComponent } from './calendar-tab/calendar-tab.component';
import { DashboardPageComponent } from './dashboard-page/dashboard-page.component';
import { SessionComponent } from './session/session.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardPageComponent,
    children: [
      { path: '', component: CalendarTabComponent },
      { path: 'session', component: SessionComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
