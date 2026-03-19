import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiClient, Client, Organization } from '../../../core/http/api-client';

@Component({
  selector: 'app-clients-page',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="page">
      <header class="page-header">
        <h1 class="page-title">Заказчики</h1>
      </header>

      <div class="grid">
        <section class="panel">
          <div class="panel-head">
            <h2 class="panel-title">Организации</h2>
            <button type="button" class="btn btn-primary" (click)="openOrgCreate()">Добавить</button>
          </div>

          <ul class="list">
            @for (org of organizations(); track org.id) {
              <li>
                <div
                  class="list-item"
                  [class.selected]="selectedOrgId() === org.id"
                >
                  <button type="button" class="list-item-click" (click)="selectOrg(org.id)">
                    <span class="list-item-name">{{ org.name }}</span>
                  </button>
                  <span class="list-item-meta">
                    {{ org._count?.clients ?? 0 }}
                  </span>
                </div>
              </li>
            } @empty {
              <li class="list-empty">Нет организаций</li>
            }
          </ul>
        </section>

        <section class="panel">
          <div class="panel-head">
            <h2 class="panel-title">Заказчики</h2>
            <button type="button" class="btn btn-primary" (click)="openClientCreate()">Добавить заказчика</button>
          </div>

          <ul class="list">
            @if (!selectedOrgId()) {
              <li class="list-empty">Выберите организацию слева</li>
            } @else {
              @for (client of clients(); track client.id) {
                <li>
                  <div class="list-item">
                    <span class="list-item-name">{{ client.name }}</span>
                    <span class="list-item-meta">{{ client.organization?.name ?? '' }}</span>
                  </div>
                </li>
              } @empty {
                <li class="list-empty">Нет заказчиков для выбранной организации</li>
              }
            }
          </ul>
        </section>
      </div>
    </div>

    <!-- Add Organization modal -->
    <div class="modal-overlay" [class.open]="orgCreateOpen()">
      @if (orgCreateOpen()) {
        <div class="modal" role="dialog">
          <div class="modal-head">
            <h3 class="modal-title">Новая организация</h3>
            <button type="button" class="dialog-close" (click)="closeOrgCreate()">×</button>
          </div>
          <div class="modal-body">
            <label class="field">
              <span class="field-label">Название</span>
              <input class="input" type="text" [(ngModel)]="orgName" />
            </label>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-ghost" (click)="closeOrgCreate()">Отмена</button>
            <button type="button" class="btn btn-primary" [disabled]="!orgName.trim()" (click)="createOrg()">Создать</button>
          </div>
        </div>
      }
    </div>

    <!-- Add Client modal -->
    <div class="modal-overlay" [class.open]="clientCreateOpen()">
      @if (clientCreateOpen()) {
        <div class="modal" role="dialog">
          <div class="modal-head">
            <h3 class="modal-title">Новый заказчик</h3>
            <button type="button" class="dialog-close" (click)="closeClientCreate()">×</button>
          </div>
          <div class="modal-body">
            @if (selectedOrgId()) {
              <div class="hint">
                Организация: <b>{{ selectedOrgName() }}</b>
              </div>
            }
            <label class="field">
              <span class="field-label">Название</span>
              <input class="input" type="text" [(ngModel)]="clientName" />
            </label>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-ghost" (click)="closeClientCreate()">Отмена</button>
            <button
              type="button"
              class="btn btn-primary"
              [disabled]="!selectedOrgId() || !clientName.trim()"
              (click)="createClient()"
            >
              Создать
            </button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .page { display: flex; flex-direction: column; gap: var(--gap-page); }
      .page-header { margin: 0; }
      .page-title { font-size: var(--font-size-xl); font-weight: var(--font-weight-semibold); margin: 0; letter-spacing: 0.02em; }

      .grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--gap-cols); min-height: 420px; align-items: start; }

      .panel { background: var(--bg-panel); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.06); display: flex; flex-direction: column; }
      .panel-head { display: flex; align-items: center; justify-content: space-between; padding: var(--space-panel); border-bottom: 1px solid var(--border-subtle); }
      .panel-title { font-size: var(--font-size-lg); font-weight: var(--font-weight-semibold); margin: 0; }

      .list { list-style: none; margin: 0; padding: var(--space-list); overflow: auto; flex: 1; }
      .list-empty { padding: 16px 12px; font-size: var(--font-size-sm); opacity: 0.7; }

      .list-item { width: 100%; display: flex; align-items: center; justify-content: space-between; gap: var(--radius-md); padding: var(--space-list-item); border: none; border-radius: var(--radius-md); transition: background 0.15s ease; }
      .list-item.selected { background: var(--accent-bg); color: var(--accent); }

      .list-item-click { cursor: pointer; background: none; border: none; padding: 0; margin: 0; width: 100%; text-align: left; display: flex; align-items: center; }
      .list-item-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .list-item-meta { font-size: var(--font-size-xs); opacity: 0.75; }

      /* Modal */
      .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.25); display: none; align-items: center; justify-content: center; z-index: 1000; padding: var(--space-content); }
      .modal-overlay.open { display: flex; }
      .modal { background: var(--bg-panel); border-radius: var(--radius-lg); box-shadow: 0 8px 32px rgba(0,0,0,0.15); width: min(900px, 100%); max-height: 90vh; overflow: hidden; display: flex; flex-direction: column; }
      .modal-head { display: flex; align-items: center; justify-content: space-between; padding: var(--space-panel); border-bottom: 1px solid var(--border-subtle); }
      .modal-title { margin: 0; font-size: var(--font-size-lg); font-weight: var(--font-weight-semibold); }
      .dialog-close { background: none; border: none; font-size: 1.5rem; line-height: 1; cursor: pointer; color: var(--text-secondary); padding: 4px; }
      .modal-body { padding: var(--space-panel); overflow: auto; }
      .modal-footer { padding: var(--space-panel); border-top: 1px solid var(--border-subtle); display: flex; justify-content: flex-end; gap: var(--radius-md); }

      .field { display: flex; flex-direction: column; gap: 6px; }
      .field-label { font-size: var(--font-size-sm); font-weight: var(--font-weight-medium); color: var(--text-primary); }

      .hint { margin-bottom: 12px; opacity: 0.9; font-size: var(--font-size-sm); }
    `,
  ],
})
export class ClientsPageComponent {
  private readonly api = inject(ApiClient);

  readonly organizations = signal<Organization[]>([]);
  readonly clients = signal<Client[]>([]);
  readonly selectedOrgId = signal<string | null>(null);

  readonly orgCreateOpen = signal(false);
  readonly clientCreateOpen = signal(false);

  orgName = '';
  clientName = '';

  organizationsNameById = (id: string | null): string => {
    if (!id) return '';
    return this.organizations().find((o) => o.id === id)?.name ?? '';
  };

  selectedOrgName = () => this.organizationsNameById(this.selectedOrgId());

  ngOnInit() {
    this.loadOrganizations();
  }

  private loadOrganizations() {
    this.api.getOrganizations().subscribe({
      next: (list) => {
        this.organizations.set(list ?? []);
        const current = this.selectedOrgId();
        if (!current && (list?.[0]?.id ?? null)) {
          this.selectedOrgId.set(list[0].id);
          this.loadClients(list[0].id);
        } else if (current) {
          this.loadClients(current);
        }
      },
    });
  }

  private loadClients(orgId: string) {
    this.api.getClients(orgId).subscribe({
      next: (list) => this.clients.set(list ?? []),
    });
  }

  selectOrg(orgId: string) {
    this.selectedOrgId.set(orgId);
    this.loadClients(orgId);
  }

  openOrgCreate() {
    this.orgName = '';
    this.orgCreateOpen.set(true);
  }

  closeOrgCreate() {
    this.orgCreateOpen.set(false);
  }

  createOrg() {
    const name = this.orgName.trim();
    if (!name) return;
    this.api.createOrganization({ name }).subscribe({
      next: (created) => {
        this.orgCreateOpen.set(false);
        this.loadOrganizations();
        this.selectedOrgId.set(created.id);
        this.loadClients(created.id);
      },
    });
  }

  openClientCreate() {
    if (!this.selectedOrgId()) return;
    this.clientName = '';
    this.clientCreateOpen.set(true);
  }

  closeClientCreate() {
    this.clientCreateOpen.set(false);
  }

  createClient() {
    const name = this.clientName.trim();
    const orgId = this.selectedOrgId();
    if (!orgId || !name) return;

    this.api
      .createClient({ name, organizationId: orgId })
      .subscribe({
        next: () => {
          this.clientCreateOpen.set(false);
          this.loadClients(orgId);
        },
      });
  }
}

