// Component: Used to define Angular components
// EventEmitter: Allows child components to emit custom events to parent components
// Output: Decorator that makes an EventEmitter accessible to the parent (used for communication)
import { Component, EventEmitter, Output } from '@angular/core';

// Importing the custom AuthService which contains login/logout logic shared across components
import { AuthService } from '../../services/auth.service';

// Component Decorator
@Component({
  selector: 'app-login-modal', // HTML tag name used to render this component in templates
  standalone: false, // Not a standalone component (part of a larger module)
  templateUrl: './login-modal.component.html', // Links to the external HTML file for the UI structure
  styleUrl: './login-modal.component.scss' // Links to the external SCSS file for the styles
})

// Component Class Definition
export class LoginModalComponent {
  // Emits an event to close the modal when called
  // The <void> type means it doesn’t emit any data — just a signal
  @Output() closeModal = new EventEmitter<void>();
  
  // Emits an event to notify the parent component that login was successful
  // The parent might use this to update UI or redirect the user
  @Output() loginSuccess = new EventEmitter<void>();
  

  // Properties bound to the form inputs
  username = ''; // Stores the username entered by the user in the modal
  password = ''; // Stores the password entered by the user

  // 🔽 Injecting the AuthService
  constructor(private authService: AuthService) {}
  // Dependency Injection: We inject AuthService so we can call its login method
  // The `private` keyword makes it available inside this class only

  // Called when the login form is submitted
  login(): void {
    if (this.username === 'admin' && this.password === 'admin') {
      // Call the login method from AuthService
      // This update an `isLoggedIn` flag and store data in localStorage
      this.authService.login();
      
      // Emit a "loginSuccess" event to notify the parent component that login was successful
      this.loginSuccess.emit();
      
     // Emit an event to close the modal after successful login
      this.closeModal.emit();
    } else {
      // Alert the user if login fails (wrong username/password)
      alert('Invalid credentials');
    }
  }


  // Called when the user closes the modal
  close(): void {
    // Simply emits the closeModal event to the parent to close the modal
    this.closeModal.emit();
  }
}
