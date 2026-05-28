import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWorker } from './add-worker';

describe('AddWorker', () => {
  let component: AddWorker;
  let fixture: ComponentFixture<AddWorker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddWorker],
    }).compileComponents();

    fixture = TestBed.createComponent(AddWorker);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
