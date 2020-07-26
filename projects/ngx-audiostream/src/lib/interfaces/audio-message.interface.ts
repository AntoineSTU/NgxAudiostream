export interface StartStreamMessage {
  state: 'startStream';
  data: null;
}

export interface EndStreamMessage {
  state: 'endStream';
  data: string | Error;
}

export interface BinaryDataMessage {
  state: 'binaryData';
  data: any; // Buffer doesn't work
}

export type AudioMessage = StartStreamMessage | EndStreamMessage | BinaryDataMessage;
