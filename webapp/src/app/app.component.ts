import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService, SingnallingService, StoreService } from './services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'webapp';

  private subLogin: Subscription;
  private subLogout: Subscription;

  constructor(
    public signallingService: SingnallingService,
    public authService: AuthService,
    private store: StoreService,
    private cdr: ChangeDetectorRef
  ) {
    this.subLogin = this.authService.onLogin.subscribe(user => {
      this.signallingService.connect(user).then(() => {
        this.store.setUser(user);
        this.cdr.detectChanges();
      });
    });
    this.subLogout = this.authService.onLogout.subscribe(() => {
      const user = this.store.getUser();
      if (user) {
        this.signallingService.disconnect(user).then(() => {
          this.store.setUser(null);
          this.cdr.detectChanges();
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.subLogin?.unsubscribe();
    this.subLogout?.unsubscribe();
  }

  ngOnInit(): void {
    console.log('');
  }
}
