import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-menu-component',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-menu-component.html',
  styleUrl: './user-menu-component.scss'
})
export class UserMenuComponent {
  @Input() isOpen: boolean = false;
}
