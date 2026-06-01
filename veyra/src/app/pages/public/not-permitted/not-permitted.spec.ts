import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotPermitted } from './not-permitted';

describe('NotPermitted', () => {
  let component: NotPermitted;
  let fixture: ComponentFixture<NotPermitted>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotPermitted],
    }).compileComponents();

    fixture = TestBed.createComponent(NotPermitted);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
