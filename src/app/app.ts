import { Component } from '@angular/core';
import { HeaderComponent } from "./header-component/header-component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'Cinema-Web';
}
