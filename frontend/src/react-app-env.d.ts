/// <reference types="react-scripts" />

interface Window {
  SpeechRecognition: any;
  webkitSpeechRecognition: any;
}

declare namespace MediaRecorder {
  interface MediaRecorderErrorEvent extends Event {
    name: string;
    message: string;
  }

  interface MediaRecorderEventMap {
    'dataavailable': BlobEvent;
    'error': MediaRecorderErrorEvent;
    'pause': Event;
    'resume': Event;
    'start': Event;
    'stop': Event;
  }

  interface MediaRecorderOptions {
    mimeType?: string;
    audioBitsPerSecond?: number;
    videoBitsPerSecond?: number;
    bitsPerSecond?: number;
  }

  interface MediaRecorder extends EventTarget {
    readonly mimeType: string;
    readonly state: "inactive" | "recording" | "paused";
    readonly stream: MediaStream;
    ignoreMutedMedia: boolean;
    videoBitsPerSecond: number;
    audioBitsPerSecond: number;

    new(stream: MediaStream, options?: MediaRecorderOptions): MediaRecorder;

    start(timeslice?: number): void;
    stop(): void;
    pause(): void;
    resume(): void;
    requestData(): void;

    ondataavailable: ((this: MediaRecorder, event: BlobEvent) => any) | null;
    onerror: ((this: MediaRecorder, event: MediaRecorderErrorEvent) => any) | null;
    onpause: ((this: MediaRecorder, event: Event) => any) | null;
    onresume: ((this: MediaRecorder, event: Event) => any) | null;
    onstart: ((this: MediaRecorder, event: Event) => any) | null;
    onstop: ((this: MediaRecorder, event: Event) => any) | null;

    addEventListener<K extends keyof MediaRecorderEventMap>(
      type: K,
      listener: (this: MediaRecorder, ev: MediaRecorderEventMap[K]) => any,
      options?: boolean | AddEventListenerOptions
    ): void;
    addEventListener(
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions
    ): void;
    removeEventListener<K extends keyof MediaRecorderEventMap>(
      type: K,
      listener: (this: MediaRecorder, ev: MediaRecorderEventMap[K]) => any,
      options?: boolean | EventListenerOptions
    ): void;
    removeEventListener(
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | EventListenerOptions
    ): void;
  }
}

declare var MediaRecorder: {
  prototype: MediaRecorder.MediaRecorder;
  new(stream: MediaStream, options?: MediaRecorder.MediaRecorderOptions): MediaRecorder.MediaRecorder;
  isTypeSupported(mimeType: string): boolean;
};
