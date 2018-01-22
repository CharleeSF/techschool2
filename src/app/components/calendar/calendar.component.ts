import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event.service';

const NUMBER_OF_WEEKDAYS = 7;
const MONTH_NAMES = ['January', 'February',
                    'March', 'April',
                    'May', 'June',
                    'July', 'August',
                    'September', 'Oktober',
                    'November', 'December'];
const EMPTY_DATA = {};                    

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  constructor(private eventService: EventService) { }

  state: Month;
  monthNames: string[];

  ngOnInit() {
    let [year, month] = getNow();

    this.eventService.getEvents(year, month)
    .subscribe( data => this.state = new Month(year, month, data),
               err => this.state = new Month(year, month, EMPTY_DATA));;
    
    this.monthNames = MONTH_NAMES;

  }

  changeMonth(direction) {
    let comparison;
    let adder;
    let year;
    let month;
    let resetMonth;
    if (direction==="previous") {
      comparison = this.state.month === 1;
      adder = -1;
      resetMonth = 12;
    }
    else if (direction==="next") {
      comparison = this.state.month ===12;
      adder = +1;
      resetMonth = 1;
    }

    if (comparison) {
      year = this.state.year + adder;
      month = resetMonth;
    }
    else {
      year = this.state.year;
      month = this.state.month + adder;
    }

    this.setEvents(year, month);
  }

  setEvents(year, month) {
    let serviceOutput = this.eventService.getEvents(year, month).
    subscribe( data => this.state = new Month(year, month, data),
               err => this.state = new Month(year, month, EMPTY_DATA));;
  }
}

class Month {
  year: number;
  month: number;
  startDay: number;
  numDays: number;
  weeks: Week[];
  constructor(year, month, data) {
    this.year = year;
    this.month = month;
    this.startDay = getStartDay(year, month); // on what day of the week falls the first day
    this.numDays = getNumDays(year, month);
    this.weeks = [];
    while ((this.weeks.length*NUMBER_OF_WEEKDAYS-this.startDay)<this.numDays) {
      this.weeks.push(new Week(data, year, this.month, this.weeks.length, this.startDay, this.numDays));
    }
  }
}

class Week {
  weekNum: number;
  days: Day[];
  constructor(data, year, month, numberOfWeeksSoFar, monthStartDay, numDays) {
    this.days = [];
    let startLoop = 0;
    if (numberOfWeeksSoFar == 0){
      for (let i=0; i<monthStartDay; i++) {
        this.days.push(undefined);
      }
      startLoop = monthStartDay;
    }
    for (let i=startLoop; i<NUMBER_OF_WEEKDAYS; i++) {
      let dayNum = numberOfWeeksSoFar*NUMBER_OF_WEEKDAYS-monthStartDay;

      if ((dayNum + i) < numDays) {
        this.days.push(new Day(data, year, month, dayNum+i+1, i));
      }
      else {
        this.days.push(undefined);
      }
    }
  }
}

class Day {
  monthNum: number;
  weekNum: number;
  events: Event[];
  constructor(data, year, month, monthNum, weekNum) {
    this.monthNum = monthNum;
    this.weekNum = weekNum;
    this.events = getEvents(data, year, month, this.monthNum);
  }
}

class Event {
  description: string;
  start: [number, number];
  end: [number, number];
  isLecture: boolean;
  constructor(description, start, end, isLecture) {
    this.description = description;
    this.start = start;
    this.end = end;
    this.isLecture = isLecture;
  }
}

function getNow() {
  let d = new Date();
  return [d.getFullYear(), d.getMonth()+1];
}

function getStartDay(year, month) {
  let d = new Date(`${year}-${month}-01`);
  let javascriptDay = d.getDay();
  let myDay = (javascriptDay + 6)%7; // I think monday is the first day of the week
  console.log(myDay);
  return myDay;
}

function getNumDays(year, month) {
  // even though Date months are 0-based, the current
  // approach gets the last day of the 'previous' month, so you
  // want to enter the month after the one you're interested in
  return new Date(year, month, 0).getDate();
}

function getEvents(data, year, month, dayNum) {
  if (data!==undefined) {
    let events = [];
    let eventsJson = data[dayNum];
    if (eventsJson!==undefined) {
      for (event of eventsJson) {
        console.log(event);
        events.push(new Event(event["description"],
                              [event["start_hours"], event["start_minutes"]],
                              [event["stop_hours"], event["stop_minutes"]],
                            event["isLecture"]));
      }
    }
    return events;
  }
  else {
    return [];
  }
  
}