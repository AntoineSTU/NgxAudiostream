export interface NgxAudiostreamOptions {
  latencyHint?: number | 'interactive' | 'balanced' | 'playback';
  bufferSize?: number;
  inSampleRate?: number;
  outSampleRate?: number;
}
