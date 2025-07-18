import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoviesInTheaters } from './movies-in-theaters';

describe('MoviesInTheaters', () => {
  let component: MoviesInTheaters;
  let fixture: ComponentFixture<MoviesInTheaters>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoviesInTheaters]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoviesInTheaters);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
