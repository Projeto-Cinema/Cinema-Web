import { Component } from '@angular/core';
import { HeaderComponent } from "./header-component/header-component";

@Component({
  selector: 'app-root',
  imports: [HeaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'Cinema-Web';
}
