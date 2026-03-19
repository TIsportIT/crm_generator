import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Client } from '../../../core/http/api-client';

type SectionId = 'basic' | 'address' | 'requisites' | 'finance' | 'notes';

@Component({
  selector: 'app-client-details-card',
  standalone: true,
  template: `
    <div class="card">
      <div class="card-head">
        <div class="card-title">
          {{ client?.name ?? '' }}
        </div>
      </div>

      <div class="sections">
        <div class="section">
          <div class="section-head">
            <div class="section-title">Основные</div>
            <button type="button" class="btn btn-ghost btn-sm" (click)="edit.emit('basic')">Изменить</button>
          </div>
          <div class="section-body">
            <div class="kv">
              @if (client?.contactPerson) {
                <div class="kv-row"><div class="kv-k">Контакт</div><div class="kv-v">{{ client?.contactPerson }}</div></div>
              }
              @if (client?.phone) {
                <div class="kv-row"><div class="kv-k">Телефон</div><div class="kv-v">{{ client?.phone }}</div></div>
              }
              @if (client?.email) {
                <div class="kv-row"><div class="kv-k">Email</div><div class="kv-v">{{ client?.email }}</div></div>
              }
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-head">
            <div class="section-title">Адрес</div>
            <button type="button" class="btn btn-ghost btn-sm" (click)="edit.emit('address')">Изменить</button>
          </div>
          <div class="section-body">
            <div class="kv">
              @if (client?.address) {
                <div class="kv-row"><div class="kv-k">Адрес</div><div class="kv-v">{{ client?.address }}</div></div>
              } @else {
                <div class="empty-line">—</div>
              }
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-head">
            <div class="section-title">Паспорт / Реквизиты</div>
            <button type="button" class="btn btn-ghost btn-sm" (click)="edit.emit('requisites')">Изменить</button>
          </div>
          <div class="section-body">
            <div class="kv">
              @if (client?.inn) {
                <div class="kv-row"><div class="kv-k">ИНН</div><div class="kv-v">{{ client?.inn }}</div></div>
              }
              @if (client?.kpp) {
                <div class="kv-row"><div class="kv-k">КПП</div><div class="kv-v">{{ client?.kpp }}</div></div>
              }
              @if (client?.requisites) {
                <div class="kv-row"><div class="kv-k">Реквизиты</div><div class="kv-v">{{ client?.requisites }}</div></div>
              }
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-head">
            <div class="section-title">Финансы</div>
            <button type="button" class="btn btn-ghost btn-sm" (click)="edit.emit('finance')">Изменить</button>
          </div>
          <div class="section-body">
            <div class="kv">
              @if (client?.discount != null) {
                <div class="kv-row"><div class="kv-k">Скидка</div><div class="kv-v">{{ client?.discount }}</div></div>
              }
              @if (client?.clientMarkup != null) {
                <div class="kv-row"><div class="kv-k">Наценка</div><div class="kv-v">{{ client?.clientMarkup }}</div></div>
              }
            </div>
          </div>
        </div>

        <div class="section section-wide">
          <div class="section-head">
            <div class="section-title">Заметки</div>
            <button type="button" class="btn btn-ghost btn-sm" (click)="edit.emit('notes')">Изменить</button>
          </div>
          <div class="section-body">
            <div class="kv">
              @if (client?.notes) {
                <div class="kv-row"><div class="kv-v-notes" colspan="2">{{ client?.notes }}</div></div>
              } @else {
                <div class="empty-line">—</div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .card {
        display: flex;
        flex-direction: column;
        gap: 14px;
      }

      .card-head {
        padding: 2px 0;
      }

      .card-title {
        font-size: var(--font-size-lg);
        font-weight: var(--font-weight-semibold);
      }

      .sections {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
      }

      .section {
        border: 1px solid var(--border-subtle);
        background: color-mix(in srgb, var(--bg-panel) 92%, transparent);
        border-radius: var(--radius-lg);
        overflow: hidden;
      }

      .section-wide {
        grid-column: 1 / -1;
      }

      .section-head {
        padding: var(--space-panel);
        border-bottom: 1px solid var(--border-subtle);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
      }

      .section-title {
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-medium);
      }

      .section-body {
        padding: var(--space-panel);
      }

      .kv {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .kv-row {
        display: grid;
        grid-template-columns: 120px 1fr;
        gap: 10px;
        align-items: baseline;
      }

      .kv-k {
        font-size: var(--font-size-xs);
        opacity: 0.8;
      }

      .kv-v {
        font-size: var(--font-size-sm);
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .kv-v-notes {
        font-size: var(--font-size-sm);
        grid-column: 1 / -1;
      }

      .empty-line {
        opacity: 0.6;
      }
    `,
  ],
})
export class ClientDetailsCardComponent {
  @Input({ required: true }) client!: Client | null;
  @Output() edit = new EventEmitter<string>();
}

