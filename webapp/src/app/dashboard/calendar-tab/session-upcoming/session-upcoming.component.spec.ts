import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionUpcomingComponent } from './session-upcoming.component';

describe('SessionUpcomingComponent', () => {
  let component: SessionUpcomingComponent;
  let fixture: ComponentFixture<SessionUpcomingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SessionUpcomingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionUpcomingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
