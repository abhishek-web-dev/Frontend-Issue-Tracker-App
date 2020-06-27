import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditIssuePageComponent } from './edit-issue-page.component';

describe('EditIssuePageComponent', () => {
  let component: EditIssuePageComponent;
  let fixture: ComponentFixture<EditIssuePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditIssuePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditIssuePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
