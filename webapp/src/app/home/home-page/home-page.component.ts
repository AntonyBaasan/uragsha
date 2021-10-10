import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, SingnallingService, StoreService } from 'src/app/services';
import { SessionRequestsService } from 'src/app/services/webapi/session-requests.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {

  constructor(
    public authService: AuthService,
    private signallingService: SingnallingService,
    private sessionRequestsService: SessionRequestsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    // private store: StoreService,
    private cdr: ChangeDetectorRef
  ) { }

  startIntstantSession() {
    this.router.navigate(['/call', 'session.id']);
  }

}
