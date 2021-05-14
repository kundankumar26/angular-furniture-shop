import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SliderService } from 'src/app/_services/slider.service';

@Component({
  selector: 'app-slide',
  templateUrl: './slide.component.html',
  styleUrls: ['./slide.component.css']
})
export class SlideComponent implements OnInit {

  @Output() searchText: EventEmitter<string> = new EventEmitter<string>();

  constructor(private sliderService: SliderService) { }

  ngOnInit(): void {
  }

  selectedItemMethod(itemName: string): any {
    this.searchText.emit(itemName);
    this.sliderService.setSearchText(itemName);
  }
}
