import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { combineLatest } from 'rxjs';

import { SettingsService } from '../core/settings.service';

@UntilDestroy()
@Component({
  selector: 'my-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  public sittingTimeEditing = false;
  public standingTimeEditing = false;
  public sittingAudioUrlEditing = false;
  public standingAudioUrlEditing = false;
  public editingForm = false;

  public settingsForm: FormGroup;

  constructor(
    private _settings: SettingsService,
    private _router: Router,
    private _fb: FormBuilder
  ) {}

  // TODO: tweak this so not every property is being saved every time
  public updateSetting(formValues: Record<string, unknown>): void {
    for(const key in formValues) {
      if(formValues[key]) {
        this._settings.updateSetting(key, formValues[key]);
        this[`${key}Editing`] = false;
      }
    }
    this.editingForm = false;
  }

  public enterSubmit(event, formValues: Record<string, unknown>): void {
    if(event.keyCode === 13) {
      this.updateSetting(formValues);
    }
  }

  public toggleEdit(): void {
    this.editingForm = true;
  }

  public returnToTimer(): void {
    this._router.navigate(['']);
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
      this.settingsForm = this._fb.group({
        sittingTime: sitTime,
        standingTime: standTime,
        sittingAudioUrl: sitAudio,
        standingAudioUrl: standAudio
      });
    });
   
  }
}
