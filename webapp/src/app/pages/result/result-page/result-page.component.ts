import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, switchMap, tap } from 'rxjs/operators';
import { SessionRequest } from 'src/app/models';
import { SessionRequestComment } from 'src/app/models/dto/SessionRequestComment';
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
  sessionRequestId: string;
  isSuccessfulWorkout: boolean = true;
  comment: string;

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
    this.sessionRequestDataService.get(sessionRequestId)
      .subscribe(sessionRequest => {
        if (sessionRequest.sessionId) {
          this.handleSessionResult(sessionRequest)
        } else {
          // close this result dialog if there was not match
          this.close();
        }
      });
  }

  private handleSessionResult(sessionRequest: SessionRequest) {
    this.sessionId = sessionRequest.sessionId;
    this.sessionRequestId = sessionRequest.id;

    this.sessionRequestDataService.getOtherUser(sessionRequest.id)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        }),
        tap(otherUser => {
          this.otherUserId = otherUser.uid;
          this.otherUserName = otherUser.displayName ?? '';
        }),
        switchMap(() => this.sessionRequestDataService.getComment(sessionRequest.id))
      )
      .subscribe((sessionRequestComment: SessionRequestComment) => {
        this.isSuccessfulWorkout = sessionRequestComment.isSuccessfulWorkout;
        this.comment = sessionRequestComment.comment;
      });
  }

  done() {
    this.sessionRequestDataService
      .setComment(this.sessionRequestId, this.isSuccessfulWorkout, this.comment)
      .pipe(finalize(() => this.close()))
      .subscribe();
  }

  setSuccessResult(result: boolean) {
    this.isSuccessfulWorkout = result;
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
