import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CominSoonComponent } from './comin-soon.component';

describe('CominSoonComponent', () => {
  let component: CominSoonComponent;
  let fixture: ComponentFixture<CominSoonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CominSoonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CominSoonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
