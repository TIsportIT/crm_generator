import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogComponent } from '../dialog/dialog.component';

export type SelectDialogOption = { id: string; label: string };

@Component({
  selector: 'app-select-dialog',
  standalone: true,
  imports: [FormsModule, DialogComponent],
  template: `
    <app-dialog
      [open]="open"
      [title]="title"
      [size]="size"
      [overlayZIndex]="overlayZIndex"
      (close)="close.emit()"
    >
      <div class="body">
        @if (label) {
          <div class="field">
            <span class="field-label">{{ label }}</span>
          </div>
        }

        <select class="input" [(ngModel)]="localValue">
          @if (placeholder) {
            <option [ngValue]="''" disabled hidden>{{ placeholder }}</option>
          }
          @for (opt of options; track opt.id) {
            <option [ngValue]="opt.id">{{ opt.label }}</option>
          }
        </select>
      </div>

      <div footer class="footer">
        <button type="button" class="btn btn-ghost" (click)="close.emit()">Отмена</button>
        <button
          type="button"
          class="btn btn-primary"
          [disabled]="!localValue"
          (click)="onSave()"
        >
          Сохранить
        </button>
      </div>
    </app-dialog>
  `,
  styles: [
    `
      .body {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .field-label {
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-medium);
        color: var(--text-primary);
      }
      .footer {
        width: 100%;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: var(--radius-md);
      }
    `,
  ],
})
export class SelectDialogComponent implements OnChanges {
  @Input({ required: true }) open = false;
  @Input({ required: true }) title = '';
  @Input({ required: true }) options: SelectDialogOption[] = [];
  @Input() label = '';
  @Input() placeholder = 'Выберите вариант';
  @Input() value: string | null = null;
  @Input() size: 'xs' | 'sm' | 'md' | 'lg' = 'xs';
  @Input() overlayZIndex = 1100;

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<string>();

  localValue = '';

  ngOnChanges(changes: SimpleChanges) {
    if (changes['value']) {
      this.localValue = this.value ?? '';
    }
  }

  onSave() {
    if (!this.localValue) return;
    this.save.emit(this.localValue);
  }
}

