import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-star',
  templateUrl: './star.component.html',
  styleUrls: ['./star.component.css']
})
export class StarComponent implements OnChanges {

  constructor() { }

    @Input() rating: number = 4;
    cropWidth: number = 200;

    ngOnChanges(changes: SimpleChanges): void {
        this.cropWidth = this.rating*200/5;
    }

}
