import { Component, effect, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-name-dialog',
  imports: [ReactiveFormsModule],
  templateUrl: './name-dialog.component.html',
})
export class NameDialogComponent {
  open = input(false);
  title = input('');
  label = input('Name');
  name = input('');
  confirmLabel = input('Save');
  cancelLabel = input('Cancel');

  confirmed = output<string>();
  cancelled = output<void>();

  private readonly fb = new FormBuilder();

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(200)]],
  });

  constructor() {
    effect(() => {
      if (this.open()) {
        this.form.reset({
          name: this.name() ?? '',
        });
        this.form.markAsPristine();
        this.form.markAsUntouched();
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    const value = this.form.controls.name.value.trim();
    if (!value) return;
    this.confirmed.emit(value);
  }

  onCancel() {
    this.cancelled.emit();
  }
}
