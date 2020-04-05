import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankingCardsComponent } from './banking-cards.component';

describe('BankingCardsComponent', () => {
  let component: BankingCardsComponent;
  let fixture: ComponentFixture<BankingCardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankingCardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankingCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
