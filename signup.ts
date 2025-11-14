import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user';

@Component({
  selector: 'app-signup',
  imports: [FormsModule, RouterLink,CommonModule],
  standalone: true,
  templateUrl: './signup.html',
  styleUrls: ['./signup.css']
})
export class SignupComponent {
  email = '';
  password = '';
  confirmPassword = '';
  loading = false;

  constructor(private router: Router, private userService: UserService) {}

  signup() {
    if (!this.email || !this.password || !this.confirmPassword) {
      alert('Please fill in all fields!');
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    this.loading = true;
    this.userService.signup(this.email, this.password).subscribe({
      next: (res) => {
        this.loading = false;
        alert(`Account created successfully for ${this.email}!`);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading = false;
        console.error('Signup failed:', err);
        alert(err.error?.message || 'Signup failed. Please try again.');
      }
    });
  }
}