import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestWithLibraryButtonComponent } from './test-with-library-button.component';

describe('TestWithLibraryButtonComponent', () => {
  let component: TestWithLibraryButtonComponent;
  let fixture: ComponentFixture<TestWithLibraryButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestWithLibraryButtonComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestWithLibraryButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
