import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services';

@Component({
  selector: 'app-user-stats',
  templateUrl: './user-stats.component.html',
  styleUrls: ['./user-stats.component.scss']
})
export class UserStatsComponent implements OnInit {

  // @Input()
  userStat: any = {
    displayName: '',
    session: 0,
    lastWeekSession: 0,
    streakSession: 0,
  };

  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      if (user) {
        this.userStat = {
          displayName: user?.displayName,
          session: 1034,
          lastWeekSession: 12,
          streakSession: 27,
        }
        this.cdr.detectChanges();
      }
    });
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

}
