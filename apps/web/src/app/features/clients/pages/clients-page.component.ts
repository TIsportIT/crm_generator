import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiClient, Client, Organization } from '../../../core/http/api-client';
import { DialogComponent } from '../../../shared/ui/dialog/dialog.component';
import { AvatarCircleTrayComponent } from '../../../shared/ui/avatar-circle-tray/avatar-circle-tray.component';

@Component({
  selector: 'app-clients-page',
  standalone: true,
  imports: [
    FormsModule,
    DialogComponent,
    AvatarCircleTrayComponent,
  ],
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
            <button type="button" class="btn btn-primary" (click)="openClientCreate()">Добавить</button>
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

    <!-- Add Organization dialog (UI-consistent) -->
    <app-dialog
      [open]="orgCreateOpen()"
      [title]="'Новая организация'"
      size="sm"
      (close)="closeOrgCreate()"
    >
      <label class="field">
        <span class="field-label">Название</span>
        <input class="input" type="text" [(ngModel)]="orgName" />
      </label>
      <div footer class="dialog-footer">
        <button type="button" class="btn btn-ghost" (click)="closeOrgCreate()">Отмена</button>
        <button
          type="button"
          class="btn btn-primary"
          [disabled]="!orgName.trim()"
          (click)="createOrg()"
        >
          Создать
        </button>
      </div>
    </app-dialog>

    <!-- Add Client dialog (UI-consistent) -->
    <app-dialog
      [open]="clientCreateOpen()"
      [title]="'Новый заказчик'"
      size="sm"
      (close)="closeClientCreate()"
    >
      <div class="client-org">
        <div class="client-org-title">Организация</div>

        <div class="client-org-picker">
          <app-avatar-circle-tray
            [options]="orgAvatarOptions()"
            [value]="selectedOrgId()"
            (valueChange)="onOrganizationPicked($event)"
            (addRequested)="openOrgCreateFromClient()"
            [size]="40"
            [maxSlots]="3"
            [selectDialogSize]="'xs'"
          />
        </div>

        @if (selectedOrgId()) {
          <div class="client-org-name">{{ selectedOrgName() }}</div>
        } @else {
          <div class="client-org-empty">Сначала добавьте организацию</div>
        }
      </div>

      <label class="field">
        <span class="field-label">Название</span>
        <input class="input" type="text" [(ngModel)]="clientName" />
      </label>

      <div footer class="dialog-footer">
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
    </app-dialog>
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

      .field { display: flex; flex-direction: column; gap: 6px; }
      .field-label { font-size: var(--font-size-sm); font-weight: var(--font-weight-medium); color: var(--text-primary); }
      .client-org { display: flex; flex-direction: column; gap: 10px; margin-bottom: 14px; }
      .client-org-title { font-size: var(--font-size-sm); font-weight: var(--font-weight-medium); color: var(--text-primary); }
      .client-org-picker { display: flex; align-items: center; }
      .client-org-name { font-size: var(--font-size-sm); color: var(--text-secondary); }
      .client-org-empty { font-size: var(--font-size-sm); color: var(--text-secondary); opacity: 0.9; }
      .dialog-footer { display: flex; width: 100%; justify-content: flex-end; gap: var(--radius-md); }
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

  private reopenClientDialogAfterOrg = false;

  organizationsNameById = (id: string | null): string => {
    if (!id) return '';
    return this.organizations().find((o) => o.id === id)?.name ?? '';
  };

  selectedOrgName = () => this.organizationsNameById(this.selectedOrgId());

  orgAvatarOptions = () =>
    this.organizations().map((o) => ({
      id: o.id,
      label: o.name,
    }));

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
    this.reopenClientDialogAfterOrg = false;
    this.orgCreateOpen.set(true);
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
        if (this.reopenClientDialogAfterOrg) {
          this.clientCreateOpen.set(true);
          this.reopenClientDialogAfterOrg = false;
        }
      },
    });
  }

  openClientCreate() {
    this.clientName = '';
    this.clientCreateOpen.set(true);
  }

  closeClientCreate() {
    this.clientCreateOpen.set(false);
  }

  onOrganizationPicked(orgId: string | null) {
    if (!orgId) return;
    this.selectedOrgId.set(orgId);
    this.loadClients(orgId);
  }

  openOrgCreateFromClient() {
    // Если пользователь начал с "Новый заказчик", но организаций нет — открываем создание организации
    // и после успешного создания возвращаем его в диалог создания заказчика.
    this.reopenClientDialogAfterOrg = true;
    this.clientCreateOpen.set(false);
    this.orgName = '';
    this.orgCreateOpen.set(true);
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

  closeOrgCreate() {
    this.orgCreateOpen.set(false);
    this.reopenClientDialogAfterOrg = false;
  }
}

