import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `
    <div class="empty">
      @if (title) {
        <div class="empty-title">{{ title }}</div>
      }
      @if (description) {
        <div class="empty-desc">{{ description }}</div>
      }
    </div>
  `,
  styles: [
    `
      .empty {
        padding: 16px 12px;
        border-radius: var(--radius-lg);
        border: 1px dashed var(--border-subtle);
        background: color-mix(in srgb, var(--bg-panel) 80%, transparent);
      }
      .empty-title {
        font-weight: var(--font-weight-semibold);
        margin-bottom: 6px;
        color: var(--text-primary);
      }
      .empty-desc {
        font-size: var(--font-size-sm);
        color: var(--text-secondary);
      }
    `,
  ],
})
export class EmptyStateComponent {
  @Input() title = '';
  @Input() description = '';
}

