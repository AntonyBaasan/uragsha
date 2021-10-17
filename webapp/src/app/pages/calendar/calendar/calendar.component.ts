import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component,
  EventEmitter, HostListener, Input, Output
} from '@angular/core';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { isSameDay, isSameMonth } from 'date-fns';
import { Subject } from 'rxjs';
import { SessionRequestScheduled } from 'src/app/models';
import { CalendarService } from './calendar.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent {
  @Input() set sessionRequests(sessions: SessionRequestScheduled[]) {
    this.events = this.calendarService.mapToCalendarEvent(
      sessions,
      this.actions
    );
    this.refresh.next();
  }
  @Output() sessionInsert = new EventEmitter<Date>();
  @Output() sessionRemove = new EventEmitter<string>();

  events: CalendarEvent[] = [];
  refresh: Subject<any> = new Subject();
  CalendarView = CalendarView; // enum for template
  viewDate: Date = new Date();
  view: CalendarView = CalendarView.Week;
  activeDayIsOpen: boolean = true;
  modalData: { action: string; event: CalendarEvent } | undefined;

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Deleted', event);
      },
    },
  ];

  constructor(
    private calendarService: CalendarService,
    private cdr: ChangeDetectorRef
  ) { }

  /**
   * Listen windows resize event. If small screen than show CalendarView.Day
   * if bigger screen show CalendarView.Week
   * @param event
   */
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    const appropriateViewType =
      event.target.innerWidth < 450 ? CalendarView.Day : CalendarView.Week;
    if (appropriateViewType != this.view) {
      this.setView(appropriateViewType);
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() { }

  handleEvent(action: string, event: CalendarEvent): void {
    switch (action) {
      case 'Edited':
        break;
      case 'Deleted':
        this.removeSession(event);
        break;
    }
    this.modalData = { event, action };
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  hourClicked(date: Date) {
    this.sessionInsert.emit(date);
  }

  removeSession(event: CalendarEvent) {
    this.sessionRemove.emit(event.id as string);
  }
}
