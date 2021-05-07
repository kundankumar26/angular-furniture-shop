import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardVendorComponent } from './board-vendor.component';

describe('BoardVendorComponent', () => {
  let component: BoardVendorComponent;
  let fixture: ComponentFixture<BoardVendorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoardVendorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
