import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Sala } from '../../models/sala.model';

@Component({
  selector: 'app-sala-info-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sala-info-modal.html',
  styleUrl: './sala-info-modal.scss'
})
export class SalaInfoModal {
  @Input() isOpen: boolean = false;
  @Input() sala: Sala | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }

  onConfirm(): void {
    this.confirm.emit();
  }
}
