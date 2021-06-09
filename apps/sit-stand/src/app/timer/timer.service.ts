import { Injectable, OnDestroy } from '@angular/core';

import { BehaviorSubject, Subscription, timer } from 'rxjs';


@Injectable()
export class TimerService implements OnDestroy {

 private _timerState = {
    minutes: 0,
    seconds: 0,
    milliseconds: 0
 };
 
 private _counterSubscription: Subscription;
 private _timer$ = new BehaviorSubject(this._timerState);

 public timer$ = this._timer$.asObservable();

 public startTimer(): void {
   this._counterSubscription = timer(0, 10).subscribe(() => {
    this._updateTimerState();
    this._timer$.next(this._timerState);
   });
 }

 public stopTimer(): void {
   this._counterSubscription.unsubscribe();
 }

 public resetTimer(): void {
   this._timerState = {
     minutes: 0,
     seconds: 0,
     milliseconds: 0
   };
   this._timer$.next(this._timerState);
 }

 private _updateTimerState():void {
   
  if(this._timerState.seconds === 60) {
    this._timerState.minutes++;
    this._timerState.seconds = 0;
    return;
  }

  if(this._timerState.milliseconds === 99) {
    this._timerState.seconds++;
    this._timerState.milliseconds = 0;
    return;
  }

  this._timerState.milliseconds++;
 }

 ngOnDestroy(): void {
   this._counterSubscription.unsubscribe();
 }
}


