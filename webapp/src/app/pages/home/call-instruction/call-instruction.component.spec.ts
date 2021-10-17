import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallInstructionComponent } from './call-instruction.component';

describe('CallInstructionComponent', () => {
  let component: CallInstructionComponent;
  let fixture: ComponentFixture<CallInstructionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CallInstructionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CallInstructionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
