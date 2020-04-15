import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialIntegrationComponent } from './social-integration.component';

describe('SocialIntegrationComponent', () => {
  let component: SocialIntegrationComponent;
  let fixture: ComponentFixture<SocialIntegrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SocialIntegrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialIntegrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
