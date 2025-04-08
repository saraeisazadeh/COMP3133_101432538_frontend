import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup;

  constructor(private fb: FormBuilder, private apollo: Apollo, private router: Router) {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  SIGNUP = gql`
    mutation Signup($username: String!, $email: String!, $password: String!) {
      signup(username: $username, email: $email, password: $password) {
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
    if (this.signupForm.valid) {
      const { name, email, password } = this.signupForm.value;

      this.apollo.mutate({
        mutation: this.SIGNUP,
        variables: { username: name, email, password }
      }).subscribe({
        next: (result: any) => {
          console.log('Signup successful:', result);
          localStorage.setItem('token', result.data.signup.token);
          alert('Signup successful!');
          this.router.navigate(['/login']); // ✅ redirect to login
        },
        error: (error) => {
          console.error('Signup failed:', error.message);
          alert('Signup failed: ' + error.message);
        }
      });
    } else {
      console.warn('Form is invalid');
    }
  }
}
