import { Component } from '@angular/core';

import { SettingsService } from '../core/settings.service';

@Component({
  selector: 'my-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {

  public sittingTime$ = this._settings.sittingTime$;
  public sittingTimeEditing = false;

  public standingTime = 15;

  constructor(private _settings: SettingsService) {}

  updateSetting(formValues: Record<string, unknown>): void {
    for(const key in formValues) {
      this._settings.updateSetting(key, formValues[key]);
      this[`${key}Editing`] = false;
    }
  }
}
