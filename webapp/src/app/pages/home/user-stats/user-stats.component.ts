import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services';

@Component({
  selector: 'app-user-stats',
  templateUrl: './user-stats.component.html',
  styleUrls: ['./user-stats.component.scss']
})
export class UserStatsComponent implements OnInit {

  // @Input()
  userStat: any;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.userStat = {
      displayName: 'David Hearn',
      session: 1034,
      lastWeekSession: 12,
      streakSession: 27,
    }
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }


}
