import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink,CommonModule],
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;

  constructor(private router: Router, private userService: UserService) {}

  login() {
    if (!this.email || !this.password) {
      alert('Please enter email and password');
      return;
    }

    this.loading = true;
    this.userService.login(this.email, this.password).subscribe({
      next: (res) => {
        this.loading = false;

        // ✅ Save user session
        if (res.token) localStorage.setItem('token', res.token);
        if (res.user) localStorage.setItem('user', JSON.stringify(res.user));

        alert(`Welcome back, ${this.email}!`);

        // ✅ Navigate to home page
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading = false;
        console.error('Login failed:', err);
        alert(err.error?.message || 'Login failed. Please try again.');
      }
    });
  }
}