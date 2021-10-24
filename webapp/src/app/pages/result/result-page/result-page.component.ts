import { ThrowStmt } from '@angular/compiler';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { subMinutes } from 'date-fns';
import { of } from 'rxjs/internal/observable/of';
import { delay, finalize } from 'rxjs/operators';
import { Session, SessionRequestStatus, SessionRequestType } from 'src/app/models';
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

  sessionId?: string;

  constructor(
    private auth: AuthService,
    private sessionRequestDataService: SessionRequestDataService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    console.log('Something');
    const sessionRequestId = this.route.snapshot.params['sessionRequestId']
    if (!this.auth.isLoggedIn() || !sessionRequestId) {
      // something went wrong
      this.close()
      return;
    }

    this.myName = this.auth.currentUser.value?.displayName;
    this.sessionRequestDataService.getOtherUser(sessionRequestId).subscribe(otherUser => {
      this.otherUserId = otherUser.uid;
      this.otherUserName = otherUser.displayName ?? '';
    });
    this.sessionRequestDataService.get(sessionRequestId)
      .subscribe(sessionRequest => {
        if (sessionRequest.sessionId) {
          this.isLoading = false;
          this.sessionId = sessionRequest.sessionId;
          this.cdr.detectChanges();
        } else {
          // close this result dialog if there was not match
          this.close();
        }
      });
  }

  done() {

    this.close();
  }

  private close() {
    // TODO: save result on the server
    if (window.opener) {
      window.close();
    } else {
      this.router.navigate(['/']);
    }
  }

}
