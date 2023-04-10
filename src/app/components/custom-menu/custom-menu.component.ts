import { Component, ElementRef, NgZone } from '@angular/core';
import { IpcRenderer} from "electron";

@Component({
  selector: 'app-custom-menu',
  templateUrl: './custom-menu.component.html',
  styleUrls: ['./custom-menu.component.scss']
})
export class CustomMenuComponent {
  private ipc: IpcRenderer | undefined;
  private isDragging = false;
  private mouseClickX = 0;
  private mouseClickY = 0;

  constructor(private elementRef: ElementRef, private ngZone: NgZone) {
    if (window.require) {
      try {
        this.ipc = window.require("electron").ipcRenderer;
      } catch (e) {
        throw e;
      }
    } else {
      console.warn("Electron IPC was not loaded");
    }
  }

  onMouseDown(event: MouseEvent) {
    event.preventDefault();

    this.isDragging = true;
    this.mouseClickX = event.clientX;
    this.mouseClickY = event.clientY;

    this.ngZone.runOutsideAngular(() => {
      this.elementRef.nativeElement.ownerDocument.addEventListener( 'mousemove', this.onMouseMove.bind(this), true );
      this.elementRef.nativeElement.ownerDocument.addEventListener( 'mouseup', this.onMouseUp.bind(this), true );
    });
  }

  onMouseMove(event: MouseEvent) {
    if ( this.isDragging ) {
      this.ipc?.invoke('getBounds')
      .then((bounds) => {
        const x = bounds.x + event.clientX - this.mouseClickX;
        const y = bounds.y + event.clientY - this.mouseClickY;
        this.ipc?.send('move-window', x, y)
      }); 
    }
  }

  onMouseUp() {
    if (this.isDragging) {
      this.isDragging = false;
      this.elementRef.nativeElement.ownerDocument.removeEventListener( 'mousemove', this.onMouseMove.bind(this), true );
      this.elementRef.nativeElement.ownerDocument.removeEventListener( 'mouseup', this.onMouseUp.bind(this), true );
    }
  }

  CloseApp() {
    this.ipc?.send('close');
  }

  ToggleMaximizeApp() {
    this.ipc?.send('toggle-window-maximize');
  }

  MinimizeApp() {
    this.ipc?.send('minimize');
  }

}
