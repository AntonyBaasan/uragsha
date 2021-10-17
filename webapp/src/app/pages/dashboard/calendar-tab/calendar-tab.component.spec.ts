import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarTabComponent } from './calendar-tab.component';

describe('CalendarTabComponent', () => {
  let component: CalendarTabComponent;
  let fixture: ComponentFixture<CalendarTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalendarTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
