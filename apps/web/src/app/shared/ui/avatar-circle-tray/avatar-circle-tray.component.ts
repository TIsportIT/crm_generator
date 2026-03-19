import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  AvatarPickerComponent,
  AvatarPickerOption,
} from '../avatar-picker/avatar-picker.component';

@Component({
  selector: 'app-avatar-circle-tray',
  standalone: true,
  imports: [AvatarPickerComponent],
  template: `
    <div class="tray" [style.--tray-avatar-size]="size + 'px'">
      @for (opt of displayedOptions(); track opt.id) {
        <button
          type="button"
          class="circle"
          [class.selected]="opt.id === value"
          (click)="pick(opt.id)"
          [attr.aria-label]="opt.label"
        >
          @if (opt.avatarUrl) {
            <img class="circle-img" [src]="opt.avatarUrl" alt="avatar" />
          } @else {
            <span class="circle-fallback">{{ initials(opt.label) }}</span>
          }
        </button>
      }

      <app-avatar-picker
        [options]="options"
        [value]="null"
        [size]="size"
        [selectDialogSize]="selectDialogSize"
        [overlayZIndex]="selectDialogOverlayZIndex"
        (valueChange)="valueChange.emit($event)"
        (addRequested)="addRequested.emit()"
      />
    </div>
  `,
  styles: [
    `
      .tray {
        display: flex;
        gap: 12px;
        align-items: center;
      }

      .circle {
        width: var(--tray-avatar-size);
        height: var(--tray-avatar-size);
        border-radius: 999px;
        border: 1px solid var(--border-subtle);
        background: color-mix(in srgb, var(--bg-panel) 90%, #000 6%);
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        padding: 0;
      }

      .circle.selected {
        border: 2px solid var(--accent);
      }

      .circle-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .circle-fallback {
        font-weight: var(--font-weight-semibold);
        font-size: calc(var(--tray-avatar-size) * 0.32);
        color: var(--text-secondary);
        user-select: none;
      }

      .circle.add {
        display: none;
      }
    `,
  ],
})
export class AvatarCircleTrayComponent {
  @Input({ required: true }) options: AvatarPickerOption[] = [];
  @Input() value: string | null = null;
  @Input() size = 40;
  @Input() maxSlots = 3;
  @Input() selectDialogSize: 'xs' | 'sm' | 'md' | 'lg' = 'md';
  @Input() selectDialogOverlayZIndex = 1100;

  @Output() valueChange = new EventEmitter<string | null>();
  @Output() addRequested = new EventEmitter<void>();

  displayedOptions(): AvatarPickerOption[] {
    // Один кружок всегда "Добавить". Остальные кружки - под организации.
    const orgSlotsCount = Math.max(0, Math.min(this.maxSlots - 1, 2));

    if (!this.options?.length || orgSlotsCount === 0) return [];

    const result: AvatarPickerOption[] = [];
    const selected = this.value ? this.options.find((o) => o.id === this.value) : undefined;
    if (selected) result.push(selected);

    for (const opt of this.options) {
      if (result.length >= orgSlotsCount) break;
      if (selected && opt.id === selected.id) continue;
      result.push(opt);
    }

    return result;
  }

  pick(id: string) {
    this.valueChange.emit(id);
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
}

