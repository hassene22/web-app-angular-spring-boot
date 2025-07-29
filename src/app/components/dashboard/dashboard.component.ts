import { Component, OnInit , ViewChild} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { SharedService } from '../../services/shared.service'; 
import { FactureListComponent } from '../facture-list/facture-list.component';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  
  constructor(private authService: AuthService,
   
    private router: Router, 
   private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
  }
 

 isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
   showDetails = false; // Property to control visibility

  toggleDetails(): void {
    this.showDetails = !this.showDetails;
  }
}