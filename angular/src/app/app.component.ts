/*
Non-standalone components must be declared within an NgModule to be used in your application. The module manages their dependencies and makes them available to other parts of the application.
In essence, standalone: true simplifies component creation and usage by removing the explicit need for NgModules for that specific component.
*/

import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent {
}
