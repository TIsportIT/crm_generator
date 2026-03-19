import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-dialog',
  standalone: true,
  template: `
    @if (open) {
      <div class="overlay" [style.zIndex]="overlayZIndex" (click)="onOverlayClick()">
        <div
          class="panel"
          (click)="$event.stopPropagation()"
          role="dialog"
          [style.--dialog-max-width]="dialogMaxWidth"
          [style.--dialog-height]="dialogHeight"
          [style.--dialog-space-panel]="dialogSpacePanel"
          [style.--dialog-close-font-size]="dialogCloseFontSize"
          [style.--dialog-title-font-size]="dialogTitleFontSize"
        >
          <div class="dialog-head">
            <h3 class="dialog-title">{{ title }}</h3>
            <button
              type="button"
              class="dialog-close"
              aria-label="Закрыть"
              (click)="close.emit()"
            >
              ×
            </button>
          </div>
          <div class="dialog-body">
            <ng-content />
          </div>
          @if (showFooter) {
            <div class="dialog-footer">
              <ng-content select="[footer]" />
            </div>
          }
        </div>
      </div>
    }
  `,
  styles: [
    `
      .overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 0;
        padding: var(--space-content);
      }
      .panel {
        background: var(--bg-panel);
        border-radius: var(--radius-lg);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
        max-width: var(--dialog-max-width, min(1100px, 96vw));
        width: 100%;
        height: var(--dialog-height, min(75vh, 90vh));
        max-height: 90vh; /* страховка на очень маленьких экранах */
        display: flex;
        flex-direction: column;
        min-height: 0;
      }
      .dialog-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--dialog-space-panel, var(--space-panel));
        border-bottom: 1px solid var(--border-subtle);
      }
      .dialog-title {
        font-size: var(--dialog-title-font-size, var(--font-size-lg));
        font-weight: var(--font-weight-semibold);
        margin: 0;
      }
      .dialog-close {
        background: none;
        border: none;
        font-size: var(--dialog-close-font-size, 1.5rem);
        line-height: 1;
        cursor: pointer;
        color: var(--text-secondary);
        padding: 4px;
      }
      .dialog-close:hover {
        color: var(--text-primary);
      }
      .dialog-body {
        flex: 1;
        min-height: 0;
        padding: var(--dialog-space-panel, var(--space-panel));
        overflow: auto;
      }
      .dialog-footer {
        padding: var(--dialog-space-panel, var(--space-panel));
        border-top: 1px solid var(--border-subtle);
        display: flex;
        gap: var(--radius-md);
        justify-content: flex-end;
      }
    `,
  ],
})
export class DialogComponent {
  @Input({ required: true }) open = false;
  @Input({ required: true }) title = '';
  @Input() size: 'xs' | 'sm' | 'md' | 'lg' = 'md';
  @Input() showFooter = true;
  @Input() overlayZIndex = 1000;
  @Output() close = new EventEmitter<void>();

  get dialogMaxWidth(): string {
    // Ширины подобраны под текущую верстку (две колонки на странице + большие формы).
    switch (this.size) {
      case 'xs':
        return 'min(420px, 88vw)';
      case 'sm':
        return 'min(720px, 92vw)';
      case 'lg':
        return 'min(1600px, 98vw)';
      case 'md':
      default:
        return 'min(1100px, 96vw)';
    }
  }

  get dialogHeight(): string {
    // Фиксированная высота "как в профи сайтах":
    // - диалог не растет бесконечно
    // - контент прокручивается внутри .dialog-body
    switch (this.size) {
      case 'xs':
        return '30vh';
      case 'sm':
        return '60vh';
      case 'lg':
        return '88vh';
      case 'md':
      default:
        return '75vh';
    }
  }

  get dialogSpacePanel(): string {
    // Для `sm` делаем диалог компактнее: меньше паддинги вокруг заголовка/контента/футера.
    // Это часто устраняет “съехавшую” вертикальную геометрию иконок и полей внутри.
    switch (this.size) {
      case 'xs':
        return '6px 8px';
      case 'sm':
        return '10px 12px';
      case 'lg':
        return '12px 16px';
      case 'md':
      default:
        return '12px 16px';
    }
  }

  get dialogCloseFontSize(): string {
    switch (this.size) {
      case 'xs':
        return '1.0rem';
      case 'sm':
        return '1.25rem';
      case 'lg':
        return '1.5rem';
      case 'md':
      default:
        return '1.5rem';
    }
  }

  get dialogTitleFontSize(): string {
    switch (this.size) {
      case 'xs':
        return '0.95rem';
      case 'sm':
        return '1.0rem';
      case 'lg':
        return '1.125rem';
      case 'md':
      default:
        return '1.125rem';
    }
  }

  onOverlayClick() {
    this.close.emit();
  }
}

