import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'my-projects-setting-item',
  templateUrl: './setting-item.component.html',
  styleUrls: ['./setting-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingItemComponent {

  public editingSetting = false;

  @Input() label: string;
  @Input() displayValue: string;
  @Input() control: AbstractControl;
  @Input() type = 'text';
  @Input() set editingForm(editing: boolean) {
    if(!editing) {
      this.editingSetting = false;
    }
  };

  @Output() toggleEdit = new EventEmitter<boolean>();

  public edit(): void {
    this.editingSetting = true;
    this.toggleEdit.emit();
  }

}
