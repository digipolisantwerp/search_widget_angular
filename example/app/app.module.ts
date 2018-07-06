import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { SearchWidgetModule } from '../../src';

import { AppComponent } from './app.component';

@NgModule({
  imports: [
    BrowserModule,
    SearchWidgetModule,
  ],
  declarations: [
    AppComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
