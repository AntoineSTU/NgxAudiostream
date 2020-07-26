import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgxAudiostreamService } from './ngx-audiostream.service';
import { Subscription } from 'rxjs';

import { AudioMessage } from './interfaces/audio-message.interface';
import { NgxAudiostreamOptions } from './interfaces/ngx-audiostream-options.interface';

@Component({
  selector: 'ngx-audiostream',
  templateUrl: './ngx-audiostream.component.html',
  styleUrls: ['./ngx-audiostream.component.css'],
})
export class NgxAudiostreamComponent implements OnInit {
  @Input() directlyStartRecording: boolean;
  @Input() userCanToggle: boolean;
  @Input() options?: NgxAudiostreamOptions = undefined;
  @Output() audioEmitter = new EventEmitter<AudioMessage>();

  audioSubscription: Subscription;

  constructor(private ngxAudiostreamService: NgxAudiostreamService) {}

  isRecording = false;

  ngOnInit(): void {
    this.ngxAudiostreamService.setUpService(this.options);
    this.audioSubscription = this.ngxAudiostreamService.audioSubject.subscribe((response: AudioMessage) => {
      switch (response.state) {
        case 'startStream':
          this.isRecording = true;
          break;
        case 'endStream':
          this.isRecording = false;
          break;
      }
      this.audioEmitter.emit(response);
    });
    if (this.directlyStartRecording) {
      this.startRecording();
    }
  }

  ngOnDestroy() {
    this.audioSubscription.unsubscribe();
  }

  startRecording() {
    if (!this.isRecording) {
      this.ngxAudiostreamService.startRecording();
      this.isRecording = true;
    }
  }

  stopRecording() {
    if (this.isRecording) {
      this.ngxAudiostreamService.stopRecording();
      this.isRecording = false;
    }
  }

  toggleRecording() {
    if (this.isRecording) {
      this.stopRecording();
    } else {
      this.startRecording();
    }
  }
}
