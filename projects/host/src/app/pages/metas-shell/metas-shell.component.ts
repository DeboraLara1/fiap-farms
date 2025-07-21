import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-metas-shell',
  standalone: true,
  template: `<iframe
    src="http://localhost:4203"
    frameborder="0"
    class="module-iframe"
  ></iframe>`,
  styles: [
    `
      .module-iframe {
        width: 100vw;
        height: calc(100vh - 9vh);
        border: none;
        border-radius: 0;
        background: #f8f8fa;
      }
    `,
  ],
})
export class MetasShellComponent implements AfterViewInit {
  ngAfterViewInit() {}
}
