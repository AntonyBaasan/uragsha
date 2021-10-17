import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { subMinutes } from 'date-fns';
import { of } from 'rxjs/internal/observable/of';
import { delay } from 'rxjs/operators';
import { SessionRequestStatus, SessionRequestType } from 'src/app/models';
import { SessionRequestResult } from 'src/app/models/dto/SessionRequestResult';
import { AuthService, SessionRequestDataService } from 'src/app/services';

@Component({
  selector: 'app-result-page',
  templateUrl: './result-page.component.html',
  styleUrls: ['./result-page.component.scss'],
})
export class ResultPageComponent implements OnInit {

  isLoading: boolean = true;
  myName: string | null | undefined = '';
  otherUserName: string;
  otherUserId: string;

  constructor(
    public auth: AuthService,
    private sessionRequestDataService: SessionRequestDataService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.myName = this.auth.currentUser.value?.displayName;
    const sessionRequestId = this.route.snapshot.params['sessionRequestId']
    of({
      sessionRequestId,
      sessionId: 'sessionId',
      sessionType: SessionRequestType.Scheduled,
      started: subMinutes(new Date(), 20),
      status: SessionRequestStatus.Done,
      otherUser: {
        userId: 'user2_id',
        displayName: 'David'
      }
    } as SessionRequestResult)
      .pipe(delay(2000))
      .subscribe((result) => {
        this.isLoading = false;
        this.myName = this.auth.currentUser.value?.displayName;
        this.otherUserId = result.otherUser.userId;
        this.otherUserName = result.otherUser.displayName;
      });
  }

  done() {
    // TODO: save result on the server
    this.router.navigate(['/']);
  }

}
