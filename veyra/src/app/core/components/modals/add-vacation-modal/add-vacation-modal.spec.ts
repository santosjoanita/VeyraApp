import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVacationModal } from './add-vacation-modal';

describe('AddVacationModal', () => {
  let component: AddVacationModal;
  let fixture: ComponentFixture<AddVacationModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddVacationModal],
    }).compileComponents();

    fixture = TestBed.createComponent(AddVacationModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
