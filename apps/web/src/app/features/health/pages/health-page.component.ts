import { AsyncPipe, JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ApiClient } from '../../../core/http/api-client';

@Component({
  selector: 'app-health-page',
  standalone: true,
  imports: [AsyncPipe, JsonPipe],
  template: `
    <h2>API health</h2>
    <pre>{{ health$ | async | json }}</pre>
  `,
  styles: [
    `
      pre {
        margin-top: 12px;
        padding: 12px;
        border-radius: 12px;
        background: rgba(230, 237, 243, 0.06);
        border: 1px solid rgba(230, 237, 243, 0.12);
        overflow: auto;
      }
    `,
  ],
})
export class HealthPageComponent {
  private readonly api = inject(ApiClient);
  readonly health$ = this.api.getHealth();
}

