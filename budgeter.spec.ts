import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Budgeter } from './budgeter';

describe('Budgeter', () => {
  let component: Budgeter;
  let fixture: ComponentFixture<Budgeter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Budgeter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Budgeter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
