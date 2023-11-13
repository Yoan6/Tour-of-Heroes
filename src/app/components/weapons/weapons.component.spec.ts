import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeaponsComponent } from './weapons.component';

describe('WeaponsComponent', () => {
  let component: WeaponsComponent;
  let fixture: ComponentFixture<WeaponsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WeaponsComponent]
    });
    fixture = TestBed.createComponent(WeaponsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
