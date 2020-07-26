import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxAudiostreamComponent } from './ngx-audiostream.component';
//import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

//const config: SocketIoConfig = { url: 'http://localhost:8080', options: {} };

@NgModule({
  declarations: [NgxAudiostreamComponent],
  imports: [CommonModule /*, SocketIoModule.forRoot(config)*/],
  exports: [NgxAudiostreamComponent],
})
export class NgxAudiostreamModule {}
