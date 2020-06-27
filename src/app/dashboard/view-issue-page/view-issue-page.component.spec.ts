import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewIssuePageComponent } from './view-issue-page.component';

describe('ViewIssuePageComponent', () => {
  let component: ViewIssuePageComponent;
  let fixture: ComponentFixture<ViewIssuePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewIssuePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewIssuePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
