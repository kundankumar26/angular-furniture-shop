import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SliderService {

  private selectedMenu = new BehaviorSubject(null);

  constructor() { }

  public getSearchText(): Observable<string> {
    return this.selectedMenu.asObservable();
  }
  
  public setSearchText(value: string) {
    this.selectedMenu.next(value);
  }
}
