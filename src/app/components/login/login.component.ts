import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    this.authService.isLoggedInStatus
      .pipe(take(1)) 
      .subscribe(isLoggedIn => {
        if (isLoggedIn) {
          if (this.authService.role === 'ADMIN') {
            this.router.navigate(['/admin']);
          } else if (this.authService.role === 'USER') {
            this.router.navigate(['/dashboard']);
          }
        } else {
          this.router.navigate(['/login']);
        }
      });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password);
    } else {
      this.errorMessage = 'Please fill in all fields correctly.';
    }
  }
}
