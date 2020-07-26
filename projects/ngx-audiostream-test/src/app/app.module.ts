import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NgxAudiostreamModule } from 'ngx-audiostream';
import { TestWithLibraryButtonComponent } from './test-with-library-button/test-with-library-button.component';
import { TestWithoutLibraryButtonComponent } from './test-without-library-button/test-without-library-button.component';

@NgModule({
  declarations: [AppComponent, TestWithLibraryButtonComponent, TestWithoutLibraryButtonComponent],
  imports: [BrowserModule, AppRoutingModule, NgxAudiostreamModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
