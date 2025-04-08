import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private apollo: Apollo, private router: Router) {
    this.loginForm = this.fb.group({
      usernameOrEmail: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  LOGIN = gql`
    query Login($usernameOrEmail: String!, $password: String!) {
      login(usernameOrEmail: $usernameOrEmail, password: $password) {
        token
        user {
          _id
          username
          email
        }
      }
    }
  `;

  onSubmit() {
    if (this.loginForm.valid) {
      const { usernameOrEmail, password } = this.loginForm.value;

      this.apollo.query({
        query: this.LOGIN,
        variables: { usernameOrEmail, password },
        fetchPolicy: 'no-cache'
      }).subscribe({
        next: (result: any) => {
          const token = result.data.login.token;
          localStorage.setItem('token', token);
          alert('Login successful!');
          this.router.navigate(['/add-employee']); // ✅ redirect to add-employee
        },
        error: (error) => {
          console.error('Login failed:', error.message);
          alert('Login failed: ' + error.message);
        }
      });
    } else {
      console.warn('Form is invalid');
    }
  }
}
