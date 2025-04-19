// Component: To define a new component.
// Renderer2: A service Angular provides to safely manipulate DOM elements (like styles or classes).
import { Component, Renderer2 } from '@angular/core';

// Defines metadata for the component.
@Component({
  selector: 'app-header', // This component can be used in HTML as <app-header></app-header>
  standalone: false, // Indicates this is not a standalone component (it must be declared in a module).
  templateUrl: './header.component.html', // Points to the HTML file for the view/layout of this component.
  styleUrl: './header.component.scss'// Points to the SCSS file for styling this component.
})

// Defines the actual logic and behavior of the header component using a TypeScript class.
export class HeaderComponent {
  showMobileMenu: boolean = false; // A boolean flag used to control the visibility of the mobile menu.
  fontSize: number = 16; // Stores the current font size.
  isLoginModalOpen = false; // A boolean flag used to control the visibility of the login modal.
  isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'; // A boolean flag that will let us control login and logout related things.

  constructor(private renderer: Renderer2) {} // The constructor injects the Renderer2 service: Makes the renderer available in the class to manipulate DOM styles safely.

  // Toggles the mobile menu.
  toggleMobileMenu(): void {
    this.showMobileMenu = !this.showMobileMenu; 
  }

  // Closes the mobile menu.
  closeMobileMenu(): void {
    this.showMobileMenu = false;
  }

  // Increases the font size globally.
  increaseFontSize(): void {
    if (this.fontSize < 24) {
      this.fontSize += 1;
      this.renderer.setStyle(document.documentElement, 'font-size', `${this.fontSize}px`);
    }
  }

  // Decreases the font size globally
  decreaseFontSize(): void {
    if (this.fontSize > 12) {
      this.fontSize -= 1;
      this.renderer.setStyle(document.documentElement, 'font-size', `${this.fontSize}px`);
    }
  }

  // Set the loginModelOpen to true, thus the login model will open.
  openLoginModal(): void {
    this.isLoginModalOpen = true;
  }

  // Set the isLoginModelOpen to close, thus the login model will close. In addition, check the isLoggedIn variable.
  closeLoginModal(): void {
    this.isLoginModalOpen = false;
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  }

  // Remove the "isLoggedIn" item in local storage. And put the isLoggedIn variable to false. Finally, reload the page.
  logout(): void {
    localStorage.removeItem('isLoggedIn');
    this.isLoggedIn = false;
    location.reload();
  }
}
