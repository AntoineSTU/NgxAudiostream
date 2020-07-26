/// <reference lib=“webworker”>

// Code from https://github.com/angular/angular-cli/issues/15059

// Helper class to build Worker Object URL
export class WorkerHelper {
  static buildWorkerBlobURL(workerFct: Function): string {
    let woFctNm = workerFct.name;
    let woFctStr = workerFct.toString();

    // Make sure code starts with "function()"
    // Chrome, Firefox: "[wofctNm](){...}", Safari: "function [wofctNm](){...}"
    // we need an anonymous function: "function() {...}"
    let piWoFctStr = woFctStr.replace(/^function +/, '');

    // Convert to anonymous function
    let anonWoFctStr = piWoFctStr.replace(woFctNm + '()', 'function()');

    // Self executing
    let ws = '(' + anonWoFctStr + ')();';

    // Build the worker blob
    let wb = new Blob([ws], { type: 'text/javascript' });

    let workerBlobUrl = window.URL.createObjectURL(wb);
    return workerBlobUrl;
  }
}

export function workerFunction() {
  let globalSelf = (self as any) as Worker;

  let isInit = false;
  let inSampleRate: number;
  let outSampleRate: number;

  globalSelf.onmessage = function (msg: any) {
    let result = msg.data;
    switch (result.state) {
      case 'init':
        isInit = true;
        let data = result.data;
        inSampleRate = data.inSampleRate;
        outSampleRate = data.outSampleRate;
        break;
      case 'binaryData':
        if (isInit) {
          let binaryData = result.data;
          microphoneProcess(binaryData);
        }
        break;
    }
  };

  // To do on every audio buffer
  let microphoneProcess = (left: any) => {
    // let left16 = convertFloat32ToInt16(left); // old 32 to 16 function
    let left16 = downsampleBuffer(left, inSampleRate, outSampleRate);
    globalSelf.postMessage({ state: 'binaryData', data: left16 });
  };

  // To process the audio so it can be used by Google Speech
  let downsampleBuffer = (buffer: any, sampleRate: number, outSampleRate: number) => {
    if (outSampleRate == sampleRate) {
      return buffer;
    }
    if (outSampleRate > sampleRate) {
      throw 'downsampling rate show be smaller than original sample rate';
    }
    let sampleRateRatio = sampleRate / outSampleRate;
    let newLength = Math.round(buffer.length / sampleRateRatio);
    let result = new Int16Array(newLength);
    let offsetResult = 0;
    let offsetBuffer = 0;
    while (offsetResult < result.length) {
      let nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
      let accum = 0,
        count = 0;
      for (let i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
        accum += buffer[i];
        count++;
      }

      result[offsetResult] = Math.min(1, accum / count) * 0x7fff;
      offsetResult++;
      offsetBuffer = nextOffsetBuffer;
    }
    return result.buffer;
  };

  // Old function
  /*let convertFloat32ToInt16 = (buffer: any) => {
    let l = buffer.length;
    let buf = new Int16Array(l / 3);

    while (l--) {
      if (l % 3 == 0) {
        buf[l / 3] = buffer[l] * 0xffff;
      }
    }
    return buf.buffer;
  }*/
}
