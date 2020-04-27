import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { THANKFULLComponent } from './thankfull.component';

describe('THANKFULLComponent', () => {
  let component: THANKFULLComponent;
  let fixture: ComponentFixture<THANKFULLComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ THANKFULLComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(THANKFULLComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
