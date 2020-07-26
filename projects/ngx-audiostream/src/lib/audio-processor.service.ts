import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

import { NgxAudiostreamOptions } from './interfaces/ngx-audiostream-options.interface';
import { AudioMessage } from './interfaces/audio-message.interface';
import { WorkerInitData } from './interfaces/worker.interface';

import { WorkerHelper, workerFunction } from './worker-helper';

@Injectable({
  providedIn: 'root',
})
export class AudioProcessorService implements OnDestroy {
  // Input vars
  options: NgxAudiostreamOptions;

  // Audio processing
  globalStream: MediaStream;
  input: MediaStreamAudioSourceNode;
  processor: ScriptProcessorNode; // Deprecated, il faut changer
  context: AudioContext;
  AudioContextExtended: any;

  // AudioStream constraints
  constraints: MediaStreamConstraints = {
    audio: true,
    video: false,
  };

  // Local vars
  startedRecording = false;
  streamStreaming = false;
  audioSubject = new Subject<AudioMessage>();

  // For the worker
  private workerURL: string;
  private worker: Worker | null;

  constructor() {
    this.worker = null;
    this.workerURL = WorkerHelper.buildWorkerBlobURL(workerFunction);
  }

  ngOnDestroy() {
    if (this.worker) {
      this.stopWorker();
    } else {
      throw 'There is a problem with the worker';
    }
    this.audioSubject.next({ state: 'endStream', data: 'Page deleted' });
  }

  /** To setup user data */
  setUpData(options: NgxAudiostreamOptions): void {
    this.options = options;
    this.constraints.audio = { sampleRate: this.options.inSampleRate };
    this.startWorker();
  }

  /** To setup the stream and start recording */
  private initRecording(): void {
    this.audioSubject.next({ state: 'startStream', data: null });
    this.streamStreaming = true;
    // Safari has a webkit prefix on AudioContext
    this.AudioContextExtended = (window as any).AudioContext || (window as any).webkitAudioContext;
    this.context = new this.AudioContextExtended({
      // if Non-interactive, use 'playback' or 'balanced' // https://developer.mozilla.org/en-US/docs/Web/API/AudioContextLatencyCategory
      latencyHint: this.options.latencyHint,
    });
    this.processor = this.context.createScriptProcessor(this.options.bufferSize, 1, 1);
    this.processor.connect(this.context.destination);
    this.context.resume();

    /** To set up operations on the microphone audio stream */
    const handleSuccess = (stream: any) => {
      this.globalStream = stream;
      this.input = this.context.createMediaStreamSource(stream);
      this.input.connect(this.processor);
      this.processor.onaudioprocess = (e: any) => {
        this.microphoneProcess(e);
      };
    };

    navigator.mediaDevices
      .getUserMedia(this.constraints)
      .then(handleSuccess)
      .catch((error: any) => {
        this.startedRecording = false;
        this.streamStreaming = false;
        this.audioSubject.next({ state: 'endStream', data: error });
      });
  }

  /** To process every buffer comming from the stream */
  private microphoneProcess(e: any) {
    if (this.worker) {
      this.worker.postMessage({ state: 'binaryData', data: e.inputBuffer.getChannelData(0) });
    } else {
      throw 'There is a problem with the worker';
    }
  }

  /** To start the recording while checking authorisations */
  startRecording() {
    if (this.startedRecording) {
      return;
    }
    this.startedRecording = true;
    this.initRecording();
  }

  /** To stop the recording and disconnect all the objects used to record audio */
  stopRecording() {
    if (!this.streamStreaming) {
      return;
    } // stop disconnecting if already disconnected;

    this.streamStreaming = false;
    this.startedRecording = false;
    this.audioSubject.next({ state: 'endStream', data: 'End streaming' });

    const track = this.globalStream.getTracks()[0];
    track.stop();
    this.input.disconnect(this.processor);
    this.processor.disconnect(this.context.destination);
    this.context.close().then(() => {
      /*this.input = null;
      this.processor = null;
      this.context = null;
      this.AudioContextExtended = null;*/
    });
  }

  // Worker functions

  /** To start the worker */
  startWorker() {
    this.worker = new Worker(this.workerURL);
    this.worker.onmessage = (message) => {
      // There are no messages sent from the worker for now
      const result = message.data;
      if ((result.state = 'binaryData')) {
        this.audioSubject.next({ state: 'binaryData', data: result.data });
      } else {
        console.log('Worker out ' + result);
      }
    };
    const workerInitData: WorkerInitData = {
      inSampleRate: this.options.inSampleRate ?? 44100,
      outSampleRate: this.options.outSampleRate ?? 16000,
    };
    this.worker.postMessage({ state: 'init', data: workerInitData });
  }

  /** To stop the worker */
  stopWorker() {
    if (this.worker != null) {
      this.worker.terminate();
    }
  }
}
