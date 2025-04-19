import { Component, EventEmitter, Output } from '@angular/core';
// Import Angular core features: Component for defining the class as an Angular component,
// EventEmitter for creating custom output events, and Output for marking properties as output emitters.

@Component({
  // Component decorator: provides metadata for the component.
  selector: 'app-login-modal', // HTML tag to use this component.
  standalone: false, // Component belongs to a module.
  templateUrl: './login-modal.component.html', // Path to the component's HTML template.
  styleUrl: './login-modal.component.scss' // Path to the component's SCSS styles.
})
export class LoginModalComponent {
  // LoginModalComponent class: defines the component's logic and data.
  @Output() closeModal = new EventEmitter<void>();
  // Output event: Emits when the modal should be closed (no data emitted).
  @Output() loginSuccess = new EventEmitter<void>();
  // Output event: Emits on successful login (no data emitted).

  username = ''; // Property to store the entered username (initially empty).
  password = ''; // Property to store the entered password (initially empty).

  login() {
    // Method called when the user attempts to log in.
    if (this.username === 'admin' && this.password === 'admin') {
      // Check if username and password are both 'admin'.
      localStorage.setItem('isLoggedIn', 'true'); // Store login status in browser's local storage.
      this.loginSuccess.emit(); // Emit the loginSuccess event.
      location.reload(); // Force a full page reload.
    } else {
      alert('Invalid credentials'); // Show an alert for incorrect login.
    }
  }

  close() {
    // Method called when the user wants to close the modal.
    this.closeModal.emit(); // Emit the closeModal event.
  }
}