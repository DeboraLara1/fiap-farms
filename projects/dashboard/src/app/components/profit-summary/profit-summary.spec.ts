import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfitSummary } from './profit-summary';

describe('ProfitSummary', () => {
  let component: ProfitSummary;
  let fixture: ComponentFixture<ProfitSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfitSummary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfitSummary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
