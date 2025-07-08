import { Component } from '@angular/core';
import { HeaderComponent } from "./components/header-component/header-component";
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './components/home-component/home-component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, HomeComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'Cinema-Web';
}
