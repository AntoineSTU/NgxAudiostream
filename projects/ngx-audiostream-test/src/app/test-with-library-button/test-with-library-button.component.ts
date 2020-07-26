import { Component, OnInit } from '@angular/core';
import { AudioMessage } from 'ngx-audiostream';

@Component({
  selector: 'app-test-with-library-button',
  templateUrl: './test-with-library-button.component.html',
  styleUrls: ['./test-with-library-button.component.css'],
})
export class TestWithLibraryButtonComponent implements OnInit {
  lastLog = '';
  audio: number[] = [];

  constructor() {}

  ngOnInit(): void {}

  processMessage(msg: AudioMessage) {
    switch (msg.state) {
      case 'startStream':
        this.lastLog = 'You are being recorded!';
        break;
      case 'endStream':
        this.lastLog = 'Recording has stopped!';
        console.log('Binary audio:');
        console.log(this.audio);
        this.audio = [];
        break;
      case 'binaryData':
        const buffer = new Int16Array(msg.data);
        this.audio.push(...buffer);
        break;
      default:
        console.log('Message ' + msg);
        break;
    }
  }
}
