import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SelectDialogComponent, SelectDialogOption } from '../select-dialog/select-dialog.component';

export type AvatarPickerOption = SelectDialogOption & { avatarUrl?: string };

@Component({
  selector: 'app-avatar-picker',
  standalone: true,
  imports: [SelectDialogComponent],
  template: `
    <div class="avatar-wrap" [style.--avatar-size]="size + 'px'" [class.is-empty]="!value">
      @if (selectedOption()?.avatarUrl) {
        <img class="avatar-img" [src]="selectedOption()?.avatarUrl" alt="avatar" />
      } @else {
        <div class="avatar-fallback">{{ initials(selectedOption()?.label ?? '') }}</div>
      }

      @if (!value) {
        <button type="button" class="avatar-add" aria-label="Добавить" (click)="openDialog()">
          +
        </button>
      }
    </div>

    <app-select-dialog
      [open]="dialogOpen"
      title="Выберите заказчика"
      [options]="options"
      label="Заказчик"
      placeholder="Сначала выберите"
      [value]="value"
      [size]="selectDialogSize"
      [overlayZIndex]="overlayZIndex"
      (close)="dialogOpen = false"
      (save)="onSave($event)"
    />
  `,
  styles: [
    `
      .avatar-wrap {
        width: var(--avatar-size);
        height: var(--avatar-size);
        position: relative;
        border-radius: 999px;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        background: color-mix(in srgb, var(--bg-panel) 80%, #000 6%);
        border: 1px solid var(--border-subtle);
      }

      .avatar-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .avatar-fallback {
        font-weight: var(--font-weight-semibold);
        font-size: calc(var(--avatar-size) * 0.32);
        color: var(--text-secondary);
        user-select: none;
      }

      .avatar-wrap.is-empty {
        background: color-mix(in srgb, var(--bg-panel) 92%, transparent);
        border: 2px solid var(--accent);
      }

      .avatar-add {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: color-mix(in srgb, var(--bg-panel) 70%, transparent);
        border: 0;
        cursor: pointer;
        color: var(--accent);
        font-size: calc(var(--avatar-size) * 0.44);
        font-weight: var(--font-weight-semibold);
      }

      .avatar-add:hover {
        background: color-mix(in srgb, var(--bg-panel) 35%, transparent);
      }
    `,
  ],
})
export class AvatarPickerComponent {
  @Input({ required: true }) options: AvatarPickerOption[] = [];
  @Input() value: string | null = null;
  @Input() size = 44;
  @Input() selectDialogSize: 'xs' | 'sm' | 'md' | 'lg' = 'xs';
  @Input() overlayZIndex = 1100;
  @Output() valueChange = new EventEmitter<string | null>();
  @Output() addRequested = new EventEmitter<void>();

  dialogOpen = false;

  selectedOption(): AvatarPickerOption | undefined {
    return this.options.find((o) => o.id === this.value);
  }

  initials(label: string): string {
    const parts = label
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2);
    if (!parts.length) return '—';
    return parts.map((p) => p[0]?.toUpperCase()).join('');
  }

  openDialog() {
    // Если вариантов нет — просим пользователя сначала добавить сущность.
    if (!this.options?.length) {
      this.addRequested.emit();
      return;
    }
    this.dialogOpen = true;
  }

  onSave(id: string) {
    this.valueChange.emit(id);
    this.dialogOpen = false;
  }
}

