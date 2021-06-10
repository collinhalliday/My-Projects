import { Component } from '@angular/core';

import { SettingsService } from '../core/settings.service';

@Component({
  selector: 'my-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {

  public sittingTime$ = this._settings.sittingTime$;
  public standingTime$ = this._settings.standingTime$;
  public sittingAudioUrl$ = this._settings.sittingAudioUrl$;
  public standingAudioUrl$ = this._settings.standingAudioUrl$;

  public sittingTimeEditing = false;
  public standingTimeEditing = false;
  public sittingAudioUrlEditing = false;
  public standingAudioUrlEditing = false;
  public showSubmitBtn = false;

  constructor(private _settings: SettingsService) {}

  public updateSetting(formValues: Record<string, unknown>): void {
    for(const key in formValues) {
      if(formValues[key]) {
        this._settings.updateSetting(key, formValues[key]);
        this[`${key}Editing`] = false;
      }
    }
    this.showSubmitBtn = false;
  }

  public edit(setting: string): void {
    this[`${setting}Editing`] = true;
    this.showSubmitBtn = true;
  }
}
