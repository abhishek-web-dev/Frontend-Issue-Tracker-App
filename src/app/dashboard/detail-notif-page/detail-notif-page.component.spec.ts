import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailNotifPageComponent } from './detail-notif-page.component';

describe('DetailNotifPageComponent', () => {
  let component: DetailNotifPageComponent;
  let fixture: ComponentFixture<DetailNotifPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailNotifPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailNotifPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
