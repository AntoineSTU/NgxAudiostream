import { TestBed } from '@angular/core/testing';

import { NgxAudiostreamService } from './ngx-audiostream.service';

describe('NgxAudiostreamService', () => {
  let service: NgxAudiostreamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxAudiostreamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
