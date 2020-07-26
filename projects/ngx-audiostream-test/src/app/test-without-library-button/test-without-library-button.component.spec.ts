import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestWithoutLibraryButtonComponent } from './test-without-library-button.component';

describe('TestWithoutLibraryButtonComponent', () => {
  let component: TestWithoutLibraryButtonComponent;
  let fixture: ComponentFixture<TestWithoutLibraryButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestWithoutLibraryButtonComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestWithoutLibraryButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
