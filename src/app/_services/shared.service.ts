import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }

  private subject = new Subject<any>();
  
  sendClickEvent() {
    this.subject.next();
  }
  
  getClickEvent(): Observable<any>{ 
    return this.subject.asObservable();
  }
}
