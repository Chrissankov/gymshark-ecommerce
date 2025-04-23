// Component: Marks the class as an Angular component
// Renderer2: To safely manipulate DOM elements
// OnInit: Life cycle hook for initialization
// OnDestroy: Life cycle hook for cleanup
import { Component, Renderer2, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
// Router: Service for navigating between pages programmatically
import { Router } from '@angular/router';
// Subscription: Used for unsubscribing from observable streams to prevent memory leaks
import { Subscription } from 'rxjs';

// AuthService: Custom service to handle login and authentication logic
import { AuthService } from '../../services/auth.service';

// Component metadata (selector, template, style)
@Component({
  selector: 'app-header', // HTML tag name for the component
  standalone: false, // Not standalone; part of a module
  templateUrl: './header.component.html', // Path to the HTML template
  styleUrl: './header.component.scss' // Path to the component’s styling
})
export class HeaderComponent implements OnInit, OnDestroy {
  // Component properties (state variables)
  showMobileMenu = false; // To toggle mobile menu visibility
  fontSize = 16; // Default font size
  isLoginModalOpen = false; // State for controlling login modal visibility
  isLoggedIn = false; // Track login status

  @Output() onChangeLang = new EventEmitter<string>();

  private authSubscription!: Subscription; // To subscribe/unsubscribe to login status

  // Constructor for Dependency Injection
  constructor(
    private renderer: Renderer2, // To manipulate DOM safely
    private router: Router, // To navigate between routes
    private authService: AuthService // To interact with authentication service
  ) {}

  // Lifecycle hook: OnInit (component initialization)
  ngOnInit(): void {
    // Subscribe to authentication status observable
    this.authSubscription = this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status; // Update login status based on subscription
    });
  }

  // Lifecycle hook: OnDestroy (cleaning up resources)
  ngOnDestroy(): void {
    this.authSubscription.unsubscribe(); // Unsubscribe to prevent memory leaks
  }

  // Toggle visibility of the mobile menu
  toggleMobileMenu(): void {
    this.showMobileMenu = !this.showMobileMenu;
  }

  // Close the mobile menu
  closeMobileMenu(): void {
    this.showMobileMenu = false;
  }

  // Increase the base font size of the page (up to a limit)
  increaseFontSize(): void {
    if (this.fontSize < 24) { // Prevent increasing beyond 24px
      this.fontSize++;
      // Apply the new font size to the whole document (root element)
      this.renderer.setStyle(document.documentElement, 'font-size', `${this.fontSize}px`);
    }
  }

  // Decrease the base font size of the page (down to a minimum limit)
  decreaseFontSize(): void {
    if (this.fontSize > 12) { // Prevent decreasing below 12px
      this.fontSize--;
      // Apply the new font size to the whole document (root element)
      this.renderer.setStyle(document.documentElement, 'font-size', `${this.fontSize}px`);
    }
  }

  // Open the login modal (for login)
  openLoginModal(): void {
    this.isLoginModalOpen = true; // Set to true to show the login modal
  }

  // Close the login modal (after login or cancel)
  closeLoginModal(): void {
    this.isLoginModalOpen = false; // Set to false to hide the modal
    // Note: isLoggedIn will be updated reactively by the auth service
  }

  // Handle logout process
  logout(): void {
    this.authService.logout(); // Call logout method from AuthService
    this.router.navigate(['/']); // Redirect user to homepage after logout
  }
  

  // Navigate to e-commerce page (conditionally based on login status)
  onEcommerceClick(): void {
    if (this.isLoggedIn) {
      this.router.navigate(['/ecommerce']); // If logged in, go to e-commerce page
    } else {
      this.isLoginModalOpen = true; // Otherwise, open login modal
    }
  }

  // Navigate to the homepage (on logo click)
  onLogoClick(): void {
    this.router.navigate(["/"]); // Navigate to the root page (home)
  }

  // 
  changeLang(codeLang: string) {
    this.onChangeLang.emit(codeLang);
  }
}