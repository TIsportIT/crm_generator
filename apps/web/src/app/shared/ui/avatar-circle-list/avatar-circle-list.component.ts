import { Component, EventEmitter, Input, Output } from '@angular/core';

export type CircleItem = { id: string; label: string; avatarUrl?: string | null };

@Component({
  selector: 'app-avatar-circle-list',
  standalone: true,
  template: `
    <div class="tray" [style.--circle-size]="size + 'px'">
      @for (item of items; track item.id) {
        <button
          type="button"
          class="circle"
          [class.selected]="item.id === selectedId"
          (click)="itemClick.emit(item.id)"
          [attr.aria-label]="item.label"
        >
          @if (item.avatarUrl) {
            <img class="circle-img" [src]="item.avatarUrl" alt="avatar" />
          } @else {
            <span class="circle-fallback">{{ initials(item.label) }}</span>
          }
        </button>
      }

      @if (showAdd) {
        <button
          type="button"
          class="circle add"
          (click)="addRequested.emit()"
          aria-label="Добавить"
        >
          +
        </button>
      }
    </div>
  `,
  styles: [
    `
      .tray {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        align-items: center;
      }

      .circle {
        width: var(--circle-size);
        height: var(--circle-size);
        border-radius: 999px;
        border: 1px solid var(--border-subtle);
        background: color-mix(in srgb, var(--bg-panel) 90%, #000 6%);
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        padding: 0;
        transition: background 0.15s ease, border-color 0.15s ease;
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
        font-size: calc(var(--circle-size) * 0.32);
        color: var(--text-secondary);
        user-select: none;
      }

      .circle.add {
        background: color-mix(in srgb, var(--bg-panel) 95%, transparent);
        border: 2px solid var(--accent);
        color: var(--accent);
        font-size: calc(var(--circle-size) * 0.44);
        font-weight: var(--font-weight-semibold);
      }

      .circle.add:hover {
        background: color-mix(in srgb, var(--bg-panel) 70%, transparent);
      }
    `,
  ],
})
export class AvatarCircleListComponent {
  @Input({ required: true }) items: CircleItem[] = [];
  @Input() selectedId: string | null = null;
  @Input() size = 40;
  @Input() showAdd = false;

  @Output() itemClick = new EventEmitter<string>();
  @Output() addRequested = new EventEmitter<void>();

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

