import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TuaSpaComponent } from './tua-spa.component';

describe('TuaSpaComponent', () => {
  let component: TuaSpaComponent;
  let fixture: ComponentFixture<TuaSpaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TuaSpaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TuaSpaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
