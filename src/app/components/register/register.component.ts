import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string | null = null;
  private apiUrl = 'http://localhost:8080/api/auth/register';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['USER', Validators.required] // default role
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.http.post(this.apiUrl, this.registerForm.value).subscribe({
        next: () => this.router.navigate(['/login']),
        error: () => this.errorMessage = 'Registration failed. Try again.'
      });
    } else {
      this.errorMessage = 'Please fill in all fields correctly.';
    }
  }
}
