/*
Non-standalone components must be declared within an NgModule to be used in your application. The module manages their dependencies and makes them available to other parts of the application.
In essence, standalone: true simplifies component creation and usage by removing the explicit need for NgModules for that specific component.
*/

import { Component } from '@angular/core';

@Component({
  selector: 'app-root', // Selector to use this component in HTML
  templateUrl: './app.component.html', // Component HTML template
  standalone: false, // Part of a module, not standalone
  styleUrl: './app.component.scss' // Component styling
})
export class AppComponent {
}
