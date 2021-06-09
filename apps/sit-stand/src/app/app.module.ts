import { DecimalPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { TimerComponent } from './timer/timer.component';

@NgModule({
  declarations: [AppComponent, TimerComponent],
  imports: [BrowserModule],
  providers: [DecimalPipe],
  bootstrap: [AppComponent],
})
export class AppModule {}
