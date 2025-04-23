import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-modal',
  standalone: false,
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss'],
})
export class LoginModalComponent {
  @Output() closeModal = new EventEmitter<void>();
  @Output() loginSuccess = new EventEmitter<void>();

  loginForm: FormGroup;
  signUpForm: FormGroup;
  isSignUpMode: boolean = false; // Flag to toggle between login and sign-up

  constructor(private fb: FormBuilder, private authService: AuthService) {
    // Login form
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    // Sign-up form
    this.signUpForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  login(): void {
    const { username, password } = this.loginForm.value;
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const matchedUser = storedUsers.find(
      (user: any) => user.username === username && user.password === password
    );

    if (matchedUser) {
      this.authService.login(); // This sets your isLoggedIn flag
      this.loginSuccess.emit();
      this.closeModal.emit();
    } else {
      alert('Invalid credentials');
    }
  }

  signUp(): void {
    const { username, password, confirmPassword } = this.signUpForm.value;

    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');

    const userExists = existingUsers.some(
      (user: any) => user.username === username
    );
    if (userExists) {
      alert('Username already taken!');
      return;
    }

    existingUsers.push({ username, password });
    localStorage.setItem('users', JSON.stringify(existingUsers));

    this.authService.signUp(username, password);
    this.loginSuccess.emit();
    this.closeModal.emit();
  }

  close(): void {
    this.closeModal.emit();
  }

  toggleSignUpMode(): void {
    this.isSignUpMode = !this.isSignUpMode;
  }
}
