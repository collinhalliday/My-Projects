import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'my-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  public sittingTime = 45;

  constructor() { }

  ngOnInit(): void {
  }

}
