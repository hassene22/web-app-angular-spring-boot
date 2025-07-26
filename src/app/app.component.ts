import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'my-project';
   isLoggedIn: boolean = false; // Explicitly define isLoggedIn with type boolean
    notLoggedIn: boolean = true; // Explicitly define notLoggedIn with type boolean
  constructor() {
    // Replace with your actual authentication logic, e.g., checking a token
    this.isLoggedIn = !!localStorage.getItem('authToken');
    this.notLoggedIn = !this.isLoggedIn; // Update notLoggedIn based on isLoggedIn
     // Example logic
  }
}
