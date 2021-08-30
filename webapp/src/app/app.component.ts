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
    private store: StoreService,
    private cdr: ChangeDetectorRef
  ) {
    this.subCurrentUserChange = this.authService.currentUser.subscribe(user => {
      if (user) {
        this.signallingService.connect(user).then(() => {
          this.store.setUser(user);
          this.cdr.detectChanges();
        });
      } else {
        const user = this.store.getUser();
        if (user) {
          this.signallingService.disconnect(user).then(() => {
            this.store.setUser(null);
            this.cdr.detectChanges();
          });
        }
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
