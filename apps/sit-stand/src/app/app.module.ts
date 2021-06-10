import { DecimalPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { TimerComponent } from './timer/timer.component';
import { SettingsComponent } from './settings/settings.component';
import { RouterModule } from '@angular/router';


const routes = [{
  path: '',
  component: TimerComponent
},
{
  path: 'settings',
  component: SettingsComponent
}];

@NgModule({
  declarations: [AppComponent, TimerComponent, SettingsComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  providers: [DecimalPipe],
  bootstrap: [AppComponent],
})
export class AppModule {}
