import { Component, HostListener} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet,RouterLink,Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet,RouterLink,CommonModule,HttpClientModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  lastScrollTop = 0;
  navbarTop = '0';
  isLoggedIn = false; // ✅ make this reactive

  constructor(private router: Router) {
    // Initialize login status
    this.isLoggedIn = !!localStorage.getItem('user');
  }

  /** Auto-hide navbar on scroll */
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const st = window.pageYOffset || document.documentElement.scrollTop;
    if (st > this.lastScrollTop) {
      this.navbarTop = '-100px';
    } else {
      this.navbarTop = '0';
    }
    this.lastScrollTop = st <= 0 ? 0 : st;
  }

  /** ✅ Watch for login/logout changes across app */
  ngOnInit() {
    window.addEventListener('storage', () => {
      this.isLoggedIn = !!localStorage.getItem('user');
    });

    // Optional: also check on route changes
    this.router.events.subscribe(() => {
      this.isLoggedIn = !!localStorage.getItem('user');
    });
  }

  /** ✅ Logout user */
  logout() {
    localStorage.removeItem('user');
    this.isLoggedIn = false;
    alert('You have been logged out.');
    this.router.navigate(['/login']);
  }
}