import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { APP_VERSION } from '../config/app-version';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="shell">
      <header class="topbar">
        <div class="brand">
          New App
          <span class="app-version">v{{ appVersion }}</span>
        </div>
        <nav class="nav">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }"
            >Home</a
          >
          <a routerLink="/health" routerLinkActive="active">Health</a>
          <a routerLink="/clients" routerLinkActive="active">Заказчики</a>
          <a routerLink="/settings" routerLinkActive="active">Settings</a>
        </nav>
      </header>

      <main class="content">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [
    `
      .shell {
        min-height: 100dvh;
        display: grid;
        grid-template-rows: auto 1fr;
        background: var(--bg-page);
        color: var(--text-primary);
      }
      .topbar {
        position: sticky;
        top: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 14px 18px;
        border-bottom: 1px solid var(--border-subtle);
        background: color-mix(in srgb, var(--bg-panel) 92%, transparent);
        backdrop-filter: blur(8px);
      }
      .brand {
        font-weight: 700;
        letter-spacing: 0.3px;
        display: flex;
        align-items: baseline;
        gap: 10px;
      }
      .app-version {
        font-size: var(--font-size-xs);
        opacity: 0.75;
        font-weight: var(--font-weight-medium);
      }
      .nav {
        display: flex;
        gap: 14px;
      }
      .nav a {
        color: var(--text-secondary);
        text-decoration: none;
        padding: 6px 8px;
        border-radius: 8px;
      }
      .nav a.active {
        color: var(--accent);
        background: var(--accent-bg);
      }
      .content {
        padding: 18px;
      }
    `,
  ],
})
export class AppLayoutComponent {
  readonly appVersion = APP_VERSION;
}


