// Marks the class as injectable (dependency injection support)
import { Injectable } from '@angular/core';

// CanActivate: Interface for route guards (controls if a route can be activated)
// Router: Allows navigation via code (e.g., redirecting to another page)
import { CanActivate, Router } from '@angular/router';

// Registering this service as a root-level singleton
@Injectable({
  providedIn: 'root',
})

// This guard will be available globally in the app
export class AuthGuard implements CanActivate {
  // Inject the Router service so we can programmatically redirect users
  constructor(private router: Router) {}

  // CanActivate logic: runs before route loads
  canActivate(): boolean {
    // Check if 'isLoggedIn' flag in localStorage is set to 'true'
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (!isLoggedIn) {
      this.router.navigate(['/']); // Redirect to homepage or login if not logged in
      return false; // Block access to the protected route
    }

    return true; // Allow access if user is logged in
  }
}
