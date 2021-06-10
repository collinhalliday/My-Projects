import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { iif, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { TimerService } from './timer.service';

@Component({
  selector: 'my-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
  providers: [TimerService]
})
export class TimerComponent {

  private readonly _standingTime = 15;
  private readonly _sittingTime = 45;
  private readonly _sittingAudioURL = 'https://www.youtube.com/watch?v=IYH7_GzP4Tg';
  private readonly _standingAudioURL = 'https://www.youtube.com/watch?v=hwZNL7QVJjE';

  public timerActions = TimerActions;
  public actions = Actions;
  public currentAction = Actions.sit;
  public currentActionTime = this._sittingTime;
  public currentActionAudioURL = this._sittingAudioURL;
  public timerRunning = false;

  public timer$ = this._timerService.timer$.pipe(
    switchMap(timerState => iif(() => timerState.minutes === this.currentActionTime, this._finishTimer$, of(timerState)))
  );

  private _finishTimer$ = of({ 
    minutes: 0,
    seconds: 0,
    milliseconds: 0
  }).pipe(
    tap(() => {
      this.timerRunner(this.timerActions.stop);
      this.switchAction();
      this.playAudio();
  }));


  constructor(
    private _timerService: TimerService,
    private _router: Router
    ) {}

  public timerRunner(timerAction: TimerActions): void {
    this.timerRunning = !this.timerRunning;
    timerAction === this.timerActions.stop ? this._timerService.stopTimer() : this._timerService.startTimer();
  }

  public reset(): void {
    this._timerService.resetTimer();
  }

  public playAudio(): void {
    window.open(this.currentActionAudioURL);
  }

  public switchAction(): void {
    this.currentAction = this.currentAction === this.actions.sit ? this.actions.stand : this.actions.sit;
    this.currentActionTime = this.currentAction === this.actions.sit ? this._sittingTime : this._standingTime;
    this.currentActionAudioURL = this.currentAction === this.actions.sit ? this._sittingAudioURL : this._standingAudioURL;
    this.reset();
  }

  public navigateToSettings(): void {
    this._router.navigate(['settings']);
  }

}

enum Actions {
  sit = 'Sit',
  stand = 'Stand'
}

enum TimerActions {
  start = 'Start',
  stop = 'Stop'
}
