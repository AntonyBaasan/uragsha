import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, SessionRequestFactoryService, SessionRequestsDataService } from 'src/app/services';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {

  constructor(
    public authService: AuthService,
    private sessionRequestsDataService: SessionRequestsDataService,
    private sessionRequestFactoryService: SessionRequestFactoryService,
    private router: Router,
  ) { }

  startIntstantSession() {
    const user = this.authService.currentUser;
    if (user.value) {
      const newInstantSessionRequest = this.sessionRequestFactoryService.createInstant(user.value.uid);
      this.sessionRequestsDataService.create(newInstantSessionRequest).subscribe(sessionRequest => {
        this.router.navigate(['/call', sessionRequest.id]);
      });
    }
  }



}
