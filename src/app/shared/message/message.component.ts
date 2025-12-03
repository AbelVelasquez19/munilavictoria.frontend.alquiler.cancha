import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-message',
  imports: [NgClass,NgIf],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent {
  isVisible = false;
  message = '';
  type: 'success' | 'error' | 'warning' = 'success';

  show(msg: string, type: 'success' | 'error' | 'warning') {
    this.message = msg;
    this.type = type;
    this.isVisible = true;
  }

  close() {
    this.isVisible = false;
  }
}
