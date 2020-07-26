import { Component, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';
import { NgxAudiostreamService } from 'ngx-audiostream';
import { AudioMessage } from 'ngx-audiostream';

@Component({
  selector: 'app-test-without-library-button',
  templateUrl: './test-without-library-button.component.html',
  styleUrls: ['./test-without-library-button.component.css'],
})
export class TestWithoutLibraryButtonComponent implements OnInit {
  audioSubscription: Subscription;
  lastLog = '';
  isRecording = false;
  audio: number[];

  constructor(private ngxAudiostreamService: NgxAudiostreamService) {}

  ngOnInit(): void {
    this.audioSubscription = this.ngxAudiostreamService.audioSubject.subscribe((msg: AudioMessage) => {
      switch (msg.state) {
        case 'startStream':
          this.lastLog = 'You are being recorded!';
          this.isRecording = true;
          this.audio = [];
          break;
        case 'endStream':
          this.lastLog = 'Recording has stopped!';
          this.isRecording = false;
          console.log('Binary audio:');
          console.log(this.audio);
          break;
        case 'binaryData':
          const buffer = new Int16Array(msg.data);
          this.audio.push(...buffer);
          break;
        default:
          console.log('Message ' + msg);
          break;
      }
    });
    this.ngxAudiostreamService.setUpService();
  }

  ngOnDestroy() {
    this.audioSubscription.unsubscribe();
  }

  toggleRecording() {
    if (this.isRecording) {
      this.ngxAudiostreamService.stopRecording();
    } else {
      this.ngxAudiostreamService.startRecording();
    }
  }
}
