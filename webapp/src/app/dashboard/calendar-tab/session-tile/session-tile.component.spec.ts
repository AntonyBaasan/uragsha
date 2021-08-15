import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionTileComponent } from './session-tile.component';

describe('SessionUpcomingComponent', () => {
  let component: SessionTileComponent;
  let fixture: ComponentFixture<SessionTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SessionTileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
