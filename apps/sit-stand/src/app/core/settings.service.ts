import { Injectable } from '@angular/core';

import { SessionStorage } from '@my-projects/utilities/functions';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  @SessionStorage({ key: 'sitting_time', autoSave: true, initValue: '45'}) private _sittingTimeStorage: number;
  @SessionStorage({ key: 'standing_time', autoSave: true, initValue: '15'}) private _standingTimeStorage: number;
  @SessionStorage({ key: 'sitting_audio_url', autoSave: true, initValue: 'youtube.com/watch?v=IYH7_GzP4Tg'}) private _sittingAudioUrlStorage: string;
  @SessionStorage({ key: 'standing_audio_url', autoSave: true, initValue: 'youtube.com/watch?v=hwZNL7QVJjE'}) private _standingAudioUrlStorage: string;
  
  private _sittingTime$ = new BehaviorSubject(this._sittingTime);
  public sittingTime$ = this._sittingTime$.asObservable();
  private _standingTime$ = new BehaviorSubject(this._standingTime);
  public standingTime$ = this._standingTime$.asObservable();
  private _sittingAudioUrl$ = new BehaviorSubject(this._sittingAudioUrl);
  public sittingAudioUrl$ = this._sittingAudioUrl$.asObservable();
  private _standingAudioUrl$ = new BehaviorSubject(this._standingAudioUrl);
  public standingAudioUrl$ = this._standingAudioUrl$.asObservable();

  private get _sittingTime() {
    return this._sittingTimeStorage;
  }
  private get _standingTime() {
    return this._standingTimeStorage;
  }
  private get _sittingAudioUrl() {
    return this._sittingAudioUrlStorage;
  }
    private get _standingAudioUrl() {
    return this._standingAudioUrlStorage;
  }

  public updateSetting(setting, value: unknown) {
    this[`_${setting}$`].next(value);
    this[`_${setting}Storage`] = value;
  }

}
