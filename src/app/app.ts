import { Component, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header';
import { AuthService } from './services/auth';
import { SidebarComponent } from './components/sidebar/sidebar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, SidebarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  constructor(public authService: AuthService) {}

  protected readonly title = signal('HomeInventory');

  loggedIn() {
    return this.authService.currentUser ? true : false;
  }
}
