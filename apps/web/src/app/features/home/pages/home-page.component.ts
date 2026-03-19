import { Component } from '@angular/core';

@Component({
  selector: 'app-home-page',
  standalone: true,
  template: `
    <h2>Home</h2>
    <p>Каркас готов. Бизнес-логика появится позже.</p>
  `,
  styles: [
    `
      h2 {
        margin: 0 0 8px;
      }
      p {
        margin: 0;
        opacity: 0.85;
      }
    `,
  ],
})
export class HomePageComponent {}

