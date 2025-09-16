import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import {Observable,of } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ecommerce-frontend';

  constructor(public authService: AuthService) {



  }
 
}