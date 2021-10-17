import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutEditorComponent } from './workout-editor.component';

describe('WorkoutEditorComponent', () => {
  let component: WorkoutEditorComponent;
  let fixture: ComponentFixture<WorkoutEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkoutEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkoutEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
