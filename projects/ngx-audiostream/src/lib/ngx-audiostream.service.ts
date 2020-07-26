import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';

import { NgxAudiostreamOptions } from './interfaces/ngx-audiostream-options.interface';
import { AudioProcessorService } from './audio-processor.service';
import { AudioMessage } from './interfaces/audio-message.interface';

@Injectable({
  providedIn: 'root',
})
export class NgxAudiostreamService {
  audioSubject = new Subject<AudioMessage>();
  audioSubscription: Subscription;

  isInitialised = false;

  constructor(private audioProcessorService: AudioProcessorService) {}

  /** To setup user data */
  setUpService(options?: NgxAudiostreamOptions): void {
    if (!this.isInitialised) {
      const formattedOptions = this.formatOptions(options ? options : {});
      this.audioProcessorService.setUpData(formattedOptions);
      this.audioSubscription = this.audioProcessorService.audioSubject.subscribe((msg: AudioMessage) => {
        this.audioSubject.next(msg);
      });
      this.isInitialised = true;
    }
  }

  /** To start the recording while checking authorisations */
  startRecording() {
    if (this.isInitialised) {
      this.audioProcessorService.startRecording();
    } else {
      throw 'Service not initialised (you must call the setUpService before)';
    }
  }

  /** To stop the recording and disconnect all the objects used to record audio */
  stopRecording() {
    if (this.isInitialised) {
      this.audioProcessorService.stopRecording();
    } else {
      throw 'Service not initialised (you must call the setUpService before)';
    }
  }

  /** To format the input options */
  private formatOptions(options: NgxAudiostreamOptions): NgxAudiostreamOptions {
    const newOptions: NgxAudiostreamOptions = {
      latencyHint: options.latencyHint ?? 'interactive',
      bufferSize: options.bufferSize ?? 2048,
      inSampleRate: options.inSampleRate ?? 44100,
      outSampleRate: options.outSampleRate ?? 16000,
    };
    return newOptions;
  }
}
