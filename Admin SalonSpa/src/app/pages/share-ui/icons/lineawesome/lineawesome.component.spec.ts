import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineawesomeComponent } from './lineawesome.component';

describe('LineawesomeComponent', () => {
  let component: LineawesomeComponent;
  let fixture: ComponentFixture<LineawesomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LineawesomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LineawesomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
