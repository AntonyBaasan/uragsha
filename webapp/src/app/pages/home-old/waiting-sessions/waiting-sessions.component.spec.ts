import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitingSessionsComponent } from './waiting-sessions.component';

describe('WaitingSessionsComponent', () => {
  let component: WaitingSessionsComponent;
  let fixture: ComponentFixture<WaitingSessionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WaitingSessionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WaitingSessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
