import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxAudiostreamComponent } from './ngx-audiostream.component';

describe('NgxAudiostreamComponent', () => {
  let component: NgxAudiostreamComponent;
  let fixture: ComponentFixture<NgxAudiostreamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxAudiostreamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxAudiostreamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
