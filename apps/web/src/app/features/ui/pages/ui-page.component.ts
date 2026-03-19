import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogComponent } from '../../../shared/ui/dialog/dialog.component';
import { EmptyStateComponent } from '../../../shared/ui/empty-state/empty-state.component';
import { AvatarPickerComponent, AvatarPickerOption } from '../../../shared/ui/avatar-picker/avatar-picker.component';

@Component({
  selector: 'app-ui-page',
  standalone: true,
  imports: [FormsModule, DialogComponent, EmptyStateComponent, AvatarPickerComponent],
  template: `
    <div class="page">
      <header class="page-header">
        <h1 class="page-title">UI</h1>
        <p class="page-subtitle">Каталог переиспользуемых компонентов (визуальный просмотр).</p>
      </header>

      <div class="grid">
        <section class="panel">
          <div class="panel-head">
            <h2 class="panel-title">Кнопки</h2>
          </div>
          <div class="panel-body">
            <div class="row">
              <button type="button" class="btn btn-primary">Primary</button>
              <button type="button" class="btn btn-ghost">Ghost</button>
              <button type="button" class="btn btn-ghost btn-sm">Ghost small</button>
            </div>
          </div>
        </section>

        <section class="panel">
          <div class="panel-head">
            <h2 class="panel-title">Поля ввода</h2>
          </div>
          <div class="panel-body">
            <div class="field-stack">
              <label class="field">
                <span class="field-label">Text</span>
                <input class="input" type="text" placeholder="Введите текст" />
              </label>

              <label class="field">
                <span class="field-label">Select</span>
                <select class="input" defaultValue="a">
                  <option value="a">Вариант A</option>
                  <option value="b">Вариант B</option>
                </select>
              </label>

              <label class="field">
                <span class="field-label">Textarea</span>
                <textarea class="input textarea" rows="3" placeholder="Описание..." ></textarea>
              </label>
            </div>
          </div>
        </section>

        <section class="panel panel-wide">
          <div class="panel-head">
            <h2 class="panel-title">Empty state</h2>
          </div>
          <div class="panel-body">
            <app-empty-state
              title="Пусто"
              description="Здесь показано переиспользуемое состояние для пустых списков/данных."
            />
          </div>
        </section>

        <section class="panel panel-wide">
          <div class="panel-head">
            <h2 class="panel-title">Dialog</h2>
          </div>
          <div class="panel-body">
            <div class="row">
              <button type="button" class="btn btn-primary" (click)="openDialog('sm')">Small</button>
              <button type="button" class="btn btn-primary" (click)="openDialog('md')">Medium</button>
              <button type="button" class="btn btn-primary" (click)="openDialog('lg')">Large</button>
            </div>

            <app-dialog
              [open]="dialogOpen()"
              [title]="'Пример диалога'"
              [size]="dialogSize()"
              (close)="dialogOpen.set(false)"
            >
              <p class="dialog-text">
                Это пример переиспользуемого диалогового окна. Внутрь можно вставлять любой контент.
              </p>
              <div footer>
                <button type="button" class="btn btn-ghost" (click)="dialogOpen.set(false)">Отмена</button>
                <button type="button" class="btn btn-primary" (click)="dialogOpen.set(false)">Ok</button>
              </div>
            </app-dialog>
          </div>
        </section>

        <section class="panel panel-wide">
          <div class="panel-head">
            <h2 class="panel-title">Avatar + Dialog select</h2>
          </div>
          <div class="panel-body">
            <div class="avatar-demo">
              <app-avatar-picker
                [options]="avatarOptions"
                [value]="avatarClientId()"
                (valueChange)="avatarClientId.set($event)"
                [size]="40"
              />

              <div class="avatar-demo-meta">
                <div class="meta-line">
                  Выбрано: <b>{{ avatarClientId() ?? 'нет' }}</b>
                </div>
                <div class="meta-desc">
                  Если заказчика нет — нажми на круг с `+`, выбери из выпадающего списка и сохрани.
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [
    `
      .page { display: flex; flex-direction: column; gap: var(--gap-page); }
      .page-header { margin: 0; }
      .page-title { font-size: var(--font-size-xl); font-weight: var(--font-weight-semibold); margin: 0; }
      .page-subtitle { margin: 8px 0 0; color: var(--text-secondary); font-size: var(--font-size-sm); }

      .grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--gap-cols); align-items: start; }
      .panel { background: var(--bg-panel); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
      .panel-wide { grid-column: 1 / -1; }

      .panel-head { display: flex; align-items: center; justify-content: space-between; padding: var(--space-panel); border-bottom: 1px solid var(--border-subtle); }
      .panel-title { margin: 0; font-size: var(--font-size-lg); font-weight: var(--font-weight-semibold); }
      .panel-body { padding: var(--space-panel); }

      .row { display: flex; gap: 12px; flex-wrap: wrap; }

      .field-stack { display: flex; flex-direction: column; gap: 16px; }
      .field { display: flex; flex-direction: column; gap: 6px; }
      .field-label { font-size: var(--font-size-sm); font-weight: var(--font-weight-medium); color: var(--text-primary); }

      .dialog-text { margin: 0; color: var(--text-primary); }

      .avatar-demo {
        display: flex;
        gap: 16px;
        align-items: center;
      }
      .avatar-demo-meta {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .meta-line { color: var(--text-primary); }
      .meta-desc { color: var(--text-secondary); font-size: var(--font-size-sm); }
    `,
  ],
})
export class UiPageComponent {
  dialogOpen = signal(false);
  dialogSize = signal<'sm' | 'md' | 'lg'>('md');
  avatarClientId = signal<string | null>(null);
  avatarOptions: AvatarPickerOption[] = [
    { id: 'c1', label: 'Иван Петров' },
    { id: 'c2', label: 'Алексей Смирнов' },
    { id: 'c3', label: 'Мария Кузнецова' },
  ];

  openDialog(size: 'sm' | 'md' | 'lg') {
    this.dialogSize.set(size);
    this.dialogOpen.set(true);
  }
}

