import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderComponentService {

  private searchText = new BehaviorSubject(null);

  constructor() { }

  public getSearchText(): Observable<string> {
    return this.searchText.asObservable();
  }
  
  public setSearchText(value: string) {
    this.searchText.next(value);
  }
  
}
