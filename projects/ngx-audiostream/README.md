# NgxAudiostream

This Angular 9 library provide a tool to record audio from microphone. Audio is formatted so it can be then sent to Google Speech-to-text.

A web worker is used to process the audio, so the web page won't lag.

## Examples/demo

An example that implements this library is available in this repository (it's the _ngx-audiostream-test project_). You can run it by:

1. Cloning this repository;
2. Installing the dependencies running `npm install`;
3. Running `npm run build`
4. Running `npm run start` on Angular 9;
5. Navigating to `localhost:4200`.

You can run it using the Docker image:

1. Clone this repository;
2. Build the Docker image running `docker build --tag ngx-audiostream:1.0 .`;
3. Run the Docker image using `docker run --publish 4200:80 --name nac ngx-audiostream:1.0`;
4. Navigate to `localhost:4200`.

You can remove this container by running `docker rm --force nac`.

This app will record your environment and send you back the raw audio in the console when you press the stop button.
To listen to this audio, you must turn it into a compatible format. To do so, you can copy the JS object in the console and run the `projects/ngx-audiostream-test/src/app/python-test/python_read_audio.py` python function on it. You will then be able to listen to the registered audio (it mays have a terrible sound, because of the Google encoding format).

## Usage

This library can be used thanks to a component (a button that shows when audio is recording) or a service.

### Using the library component

You must first import the ngx-audiostream module in yours.

```ts
import { NgxAudiostreamModule } from 'ngx-audiostream';

@NgModule({
  ...,
  imports: [
    NgxAudiostreamModule,
    ...]
})
```

Then, you can set the ngx-audiostream component wherever you want in your page. You can see how work all the parameters below.

```html
<ngx-audiostream
  [userCanToggle]="userCanToggle"
  [directlyStartRecording]="directlyStartRecording"
  (audioEmitter)="processMsg($event)"
></ngx-audiostream>
```

You can import the _AudioMessage_ interface, that match the logs created by the _audioEmitter_ output.

```ts
import { AudioMessage } from 'ngx-audiostream';
```

You can then send theses messages to a node server to process the audio (using socket.io for example).

### Using the service

You must first import the service in your component.

```ts
import { NgxAudiostreamService } from 'ngx-audiostream';

@Component({
  selector: 'your-component',
  templateUrl: './your.component.html',
  styleUrls: ['./your.component.css'],
})
export class YourComponent implements OnInit {

  constructor(private ngxAudiostreamService: NgxAudiostreamService) {}
```

Then you must init the service.

```ts
this.ngxAudiostreamService.setUpService();
```

You can now use all its methods to control the library (see more information below).

```ts
this.ngxAudiostreamService.startRecording();
this.ngxAudiostreamService.stopRecording();
```

You can also retrieve messages from the service. You can use the _AudioMessage_ interface for them.

```ts
import { AudioMessage } from 'ngx-audiostream';
...
this.recordingStateSubscription = this.ngxAudiostreamService.audioSubject.subscribe(
  (msg: AudioMessage) => {
    ...
  }
);
```

You can then send theses messages to a node server to process the audio (using socket.io for example).

### Collect the audio

There are 3 states of messages sent by the library, as explained in the _AudioMessage_ interface.

```ts
interface StartStreamMessage {
  state: 'startStream';
  data: null;
}

interface EndStreamMessage {
  state: 'endStream';
  data: string | Error;
}

interface BinaryDataMessage {
  state: 'binaryData';
  data: Buffer;
}

type AudioMessage = StartStreamMessage | EndStreamMessage | BinaryDataMessage;
```

- The **startStream** message tells the app the stream begins. There is nothing in _data_.
- The **endStream** message tells the app the stream ends. In _data_, you can find why it was ended (an error, stopStream was called...).
- The **binaryData** message provides buffers containing a part of the audio signal. _data_ contains this buffer, that can be adjusted by the optional parameters (see below).

## API

This part describes all the input options.

- **For the component:**

  ```html
  <ngx-audiostream
    [userCanToggle]="userCanToggle"
    [directlyStartRecording]="directlyStartRecording"
    [options]="options"
    (audioEmitter)="processMessages($event)"
  ></ngx-audiostream>
  ```

  **Input:**

  | Key                    | Type                  | Required | Description                                                                          |
  | ---------------------- | --------------------- | -------- | ------------------------------------------------------------------------------------ |
  | userCanToggle          | boolean               | Yes      | Enable users to click the button to start/stop the recorder                          |
  | directlyStartRecording | boolean               | Yes      | Start the recording when the component is initalised. May not work on some browsers. |
  | options                | NgxAudiostreamOptions | Optional | Some optional parameters (see below).                                                |

  **Output:**

  | Key          | Message type | Description                                                |
  | ------------ | ------------ | ---------------------------------------------------------- |
  | audioEmitter | AudioMessage | Send information about the recording and the audio signal. |

- **For the service:**

  **Methods:**

  ```ts
  this.ngxAudiostreamService.setUpService(options): null;
  ```

  This method is used to set up all parameters needed by the library to record audio and send it to the backend. **You must call it before any other method !**

  | Input parameter | Type                  | Required | Description                                                                                                                                |
  | --------------- | --------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
  | serverUrl       | string (URL)          | Yes      | The node server URL, used by the web worker to import socket.io (the socket.io module is available on _serverUrl/socket.io/socket.io.js_). |
  | options         | NgxAudiostreamOptions | Optional | Some optional parameters (see below).                                                                                                      |

  ```ts
  this.ngxAudiostreamService.startRecording(): null;
  ```

  This method tells the library to start the recording, with all the parameters given when calling the setUpService method.

  ```ts
  this.ngxAudiostreamService.stopRecording(): null;
  ```

  This method tells the library to stop the recording.

  **Subscriptions:**

  ```ts
  this.audioSubscription = this.ngxAudiostreamService.audioSubject.subscribe(
    (message: AudioMessage) => {
      ...
    }
  );
  ```

  This subject sends information about the recording and the audio signal.

- **About NgxAudiostreamOptions**

  ```ts
  interface NgxAudiostreamOptions {
    latencyHint?: number | 'interactive' | 'balanced' | 'playback';
    bufferSize?: number;
    outSampleRate?: number;
  }
  ```

  | Key           | Type                                                | Required                          | Description                                                                                                                |
  | ------------- | --------------------------------------------------- | --------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
  | latencyHint   | number or 'interactive' or 'balanced' or 'playback' | Optional (default: 'interactive') | Used when creating the AudioContext (go see https://developer.mozilla.org/en-US/docs/Web/API/AudioContextLatencyCategory). |
  | bufferSize    | Positive integer                                    | Optional (default: 2048)          | Size of the buffers containing the audio and sent to the server.                                                           |
  | outSampleRate | Positive integer (< 44100)                          | Optional (default: 16000)         | Sample rate of the audio signal sent to the back.                                                                          |

- **About AudioMessage**

```ts
interface StartStreamMessage {
  state: 'startStream';
  data: null;
}
interface EndStreamMessage {
  state: 'endStream';
  data: string | Error;
}

interface BinaryDataMessage {
  state: 'binaryData';
  data: Buffer;
}

type AudioMessage = StartStreamMessage | EndStreamMessage | BinaryDataMessage;
```

| Key   | Type                                         | Description                                                                                                                            |
| ----- | -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| state | 'startStream' or 'endStream' or 'binaryData' | Give information about the message state (if the recording begins, if it ends, or if the message provides a part of the audio signal). |
| data  | string or Error or Buffer                    | Any information given to understant why the recording ended, or a buffer that contains a part of the audio signal.                     |

## Additional information

- This library was created on the work of **_vin-ni_**, particulary on [this repository](https://github.com/vin-ni/Google-Cloud-Speech-Node-Socket-Playground). You can use it to implement a Node server streaming to the Google Speech-to-text API.

- You can check additional information about **Google Speech-to-text** methods by checking on the [official documentation](https://cloud.google.com/speech-to-text/docs/).

## Copyrights

Integrate or build upon it for free in your personal or commercial projects. Don't republish, redistribute or sell "as-is". You can contact me at `stutz.antoine@orange.fr`.
