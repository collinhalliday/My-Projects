import { Injectable } from '@angular/core';

import { SessionStorage } from '@my-projects/utilities/functions';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  @SessionStorage({ key: 'sitting_time', autoSave: true, initValue: '45'}) private _sittingTimeStorage: number;
  
  private _sittingTime$ = new BehaviorSubject(this._sittingTime);
  public sittingTime$ = this._sittingTime$.asObservable();

  private get _sittingTime() {
    return this._sittingTimeStorage;
  }

  public updateSetting(setting, value: unknown) {
    this[`_${setting}$`].next(value);
    this[`_${setting}Storage`] = value;
  }

}
