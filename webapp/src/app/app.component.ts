import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService, SingnallingService, StoreService } from './services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Uragsha';

  private subCurrentUserChange: Subscription;

  constructor(
    public signallingService: SingnallingService,
    public authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    this.subCurrentUserChange = this.authService.currentUser.subscribe(user => {
      if (user) {
        this.signallingService.connect(user).then(() => {
          this.cdr.detectChanges();
        });
      } else {
        this.signallingService.disconnect().then(() => {
          this.cdr.detectChanges();
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.subCurrentUserChange?.unsubscribe();
  }

  ngOnInit(): void {
    console.log('');
  }
}
