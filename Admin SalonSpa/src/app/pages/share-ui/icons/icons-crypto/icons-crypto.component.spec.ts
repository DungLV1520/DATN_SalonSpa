import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconsCryptoComponent } from './icons-crypto.component';

describe('IconsCryptoComponent', () => {
  let component: IconsCryptoComponent;
  let fixture: ComponentFixture<IconsCryptoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IconsCryptoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconsCryptoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
