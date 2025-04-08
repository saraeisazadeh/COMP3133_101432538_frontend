import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent {
  employees: any[] = [];
  searchTerm: string = '';
  editingEmployee: any = null;

  constructor(private apollo: Apollo) {
    this.loadEmployees();
  }

  EMPLOYEE_QUERY = gql`
    query {
      getAllEmployees {
        _id
        first_name
        last_name
        email
        gender
        salary
        department
        designation
      }
    }
  `;

  UPDATE_EMPLOYEE = gql`
    mutation UpdateEmployee(
      $eid: ID!
      $first_name: String!
      $last_name: String!
      $email: String!
      $gender: String!
      $salary: Float!
      $department: String!
      $designation: String!
    ) {
      updateEmployee(
        eid: $eid
        first_name: $first_name
        last_name: $last_name
        email: $email
        gender: $gender
        salary: $salary
        department: $department
        designation: $designation
      ) {
        _id
        first_name
        last_name
      }
    }
  `;

  DELETE_EMPLOYEE = gql`
    mutation DeleteEmployee($eid: ID!) {
      deleteEmployee(eid: $eid)
    }
  `;

  loadEmployees() {
    this.apollo.watchQuery<any>({
      query: this.EMPLOYEE_QUERY
    }).valueChanges.subscribe(({ data }) => {
      this.employees = data.getAllEmployees;
    });
  }

  filteredEmployees() {
    const term = this.searchTerm.toLowerCase();
    return this.employees.filter(emp =>
      emp.department.toLowerCase().includes(term) ||
      emp.designation.toLowerCase().includes(term)
    );
  }

  editEmployee(emp: any) {
    this.editingEmployee = { ...emp, eid: emp._id }; // include eid for mutation
  }

  saveEdit() {
    const emp = this.editingEmployee;
    emp.salary = parseFloat(emp.salary);

    this.apollo.mutate({
      mutation: this.UPDATE_EMPLOYEE,
      variables: emp
    }).subscribe({
      next: () => {
        alert('Employee updated!');
        this.editingEmployee = null;
        this.loadEmployees();
      },
      error: (err) => {
        console.error('Update error:', err.message);
      }
    });
  }

  deleteEmployee(eid: string) {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.apollo.mutate({
        mutation: this.DELETE_EMPLOYEE,
        variables: { eid }
      }).subscribe({
        next: () => {
          alert('Employee deleted!');
          this.loadEmployees();
        },
        error: (err) => {
          console.error('Delete error:', err.message);
        }
      });
    }
  }

  viewEmployee(emp: any) {
    alert(
      `Employee Details:\n\n` +
      `Name: ${emp.first_name} ${emp.last_name}\n` +
      `Email: ${emp.email}\n` +
      `Gender: ${emp.gender}\n` +
      `Designation: ${emp.designation}\n` +
      `Department: ${emp.department}\n` +
      `Salary: $${emp.salary}`
    );
  }
}
