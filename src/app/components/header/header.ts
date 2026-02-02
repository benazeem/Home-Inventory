import { Component, computed, signal, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { User } from 'firebase/auth';
import { CircleUserRound, LucideAngularModule } from 'lucide-angular';
import { ClickOutsideDirective } from '../../directives/click-outside';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.html',
  imports: [RouterLink, LucideAngularModule, ClickOutsideDirective],
})
export class HeaderComponent {
  readonly UserIcon = CircleUserRound;

  private router = inject(Router);
  constructor(private authService: AuthService) {}

  menuOpen = signal(false);
  currentUrl = signal(this.router.url);
  userMenuOpen = signal(false);

  ngOnInit() {
    // Update signal on every navigation
    this.router.events.subscribe(() => {
      this.currentUrl.set(this.router.url);
    });
  }

  showLogin = computed(() => this.currentUrl().includes('/signup'));
  showSignup = computed(() => this.currentUrl().includes('/login'));

  toggleMenu() {
    this.menuOpen.set(!this.menuOpen());
  }

  closeMenu() {
    this.menuOpen.set(false);
  }

  onRightClick() {
    return false;
  }

  loggedIn() {
    return this.authService.currentUser ? true : false;
  }

  logOut() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

  toggleUserMenu() {
    this.userMenuOpen.set(!this.userMenuOpen());
  }
}
