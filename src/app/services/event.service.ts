import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class EventService {

  constructor(private http: Http) { }

  getEvents(year, monthNumber) {
    try {
      return this.http.get(`assets/mocks_${year}_${monthNumber}.json`)
      .map(response => response.json().eventsData);
    }
    catch(err) {
      return err;
    }
  }
}