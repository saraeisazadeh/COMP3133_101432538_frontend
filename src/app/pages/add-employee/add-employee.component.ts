import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent {
  form: FormGroup;
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder, private apollo: Apollo) {
    this.form = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      department: ['', Validators.required],
      position: ['', Validators.required],
      gender: ['', Validators.required],
      salary: ['', Validators.required],
      date_of_joining: ['', Validators.required] // ✅ New field
    });
  }

  ADD_EMPLOYEE = gql`
    mutation AddEmployee(
      $first_name: String!
      $last_name: String!
      $email: String!
      $gender: String!
      $designation: String!
      $salary: Float!
      $date_of_joining: String!
      $department: String!
      $employee_photo: String!
    ) {
      addEmployee(
        first_name: $first_name
        last_name: $last_name
        email: $email
        gender: $gender
        designation: $designation
        salary: $salary
        date_of_joining: $date_of_joining
        department: $department
        employee_photo: $employee_photo
      ) {
        _id
        first_name
        last_name
      }
    }
  `;

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit() {
    if (this.form.valid) {
      const formData = this.form.value;

      const fullData = {
        ...formData,
        designation: formData.position,
        date_of_joining: new Date(formData.date_of_joining).toISOString(),
        employee_photo: this.selectedFile ? this.selectedFile.name : 'placeholder.jpg',
        salary: parseFloat(formData.salary)
      };

      console.log('Submitting:', fullData);

      this.apollo.mutate({
        mutation: this.ADD_EMPLOYEE,
        variables: fullData
      }).subscribe({
        next: (res) => {
          console.log('Employee added:', res);
          alert('Employee added successfully!');
          this.form.reset();
          this.selectedFile = null;
        },
        error: (err) => {
          console.error('Add failed:', err.message);
          alert('Error adding employee.');
        }
      });
    } else {
      alert('Please fill all required fields.');
    }
  }
}
