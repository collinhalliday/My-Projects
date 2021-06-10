import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { iif, of, combineLatest } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { TimerService } from './timer.service';
import { SettingsService } from '../core/settings.service';

@UntilDestroy()
@Component({
  selector: 'my-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
  providers: [TimerService]
})
export class TimerComponent implements OnInit {
  private _standingTime: number;
  private _sittingTime: number;
  private _sittingAudioURL: string;
  private _standingAudioURL: string;

  public currentActionTime: number;
  public currentActionAudioURL: string;
  public timerActions = TimerActions;
  public actions = Actions;
  public currentAction = Actions.sit;
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
    private _router: Router,
    private _settings: SettingsService
    ) {}

  public timerRunner(timerAction: TimerActions): void {
    this.timerRunning = !this.timerRunning;
    timerAction === this.timerActions.stop ? this._timerService.stopTimer() : this._timerService.startTimer();
  }

  public reset(): void {
    this._timerService.resetTimer();
  }

  public playAudio(): void {
    window.open(`https://www.${this.currentActionAudioURL}`);
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

  ngOnInit(): void {
    combineLatest([
      this._settings.standingTime$,
      this._settings.sittingTime$,
      this._settings.standingAudioUrl$,
      this._settings.sittingAudioUrl$
    ]).pipe(
      untilDestroyed(this)
    )
    .subscribe(([standTime, sitTime, standAudio, sitAudio]) => {
      this._standingTime = standTime;
      this._sittingTime = sitTime;
      this._sittingAudioURL = sitAudio;
      this._standingAudioURL = standAudio;

      this.currentActionTime = this.currentAction === Actions.sit ? sitTime : standTime;
      this.currentActionAudioURL = this.currentAction === Actions.sit ? sitAudio : standAudio;
    });
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
