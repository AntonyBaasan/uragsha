import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutPlayerComponent } from './workout-player.component';

describe('WorkoutPlayerComponent', () => {
  let component: WorkoutPlayerComponent;
  let fixture: ComponentFixture<WorkoutPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkoutPlayerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkoutPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
