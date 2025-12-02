import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  imports: [],
  templateUrl: './confirm-dialog.component.html',
})
export class ConfirmDialogComponent {
  open = input(false);
  title = input('Confirm');
  message = input('Are you sure?');
  confirmLabel = input('OK');
  cancelLabel = input('Cancel');
  destructive = input(false);

  confirmed = output<void>();
  cancelled = output<void>();

  onConfirm() {
    this.confirmed.emit();
  }

  onCancel() {
    this.cancelled.emit();
  }
}
