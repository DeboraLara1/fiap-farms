import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-shell',
  standalone: true,
  template: `<iframe
    src="http://localhost:4201"
    frameborder="0"
    class="module-iframe"
  ></iframe>`,
  styles: [
    `
      .module-iframe {
        width: 100vw;
        height: calc(100vh - 9vh);
      }
    `,
  ],
})
export class DashboardShellComponent implements AfterViewInit {
  ngAfterViewInit() {}
}
