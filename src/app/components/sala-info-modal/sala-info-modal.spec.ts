import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaInfoModal } from './sala-info-modal';

describe('SalaInfoModal', () => {
  let component: SalaInfoModal;
  let fixture: ComponentFixture<SalaInfoModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalaInfoModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalaInfoModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
