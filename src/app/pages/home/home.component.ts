import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentService } from '../../services/student/student.service';
import { UserService } from '../../services/user.service';
import { ChartModule } from 'primeng/chart'; // 👈 Using PrimeNG for charts

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ChartModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  totalStudents = 0;
  totalUsers = 0;

  userTypeData: any;
  studentTypeData: any;

  constructor(private studentService: StudentService, private userService: UserService) {}

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    // ✅ Load students
    this.studentService.getAll().subscribe({
      next: (students) => {
        this.totalStudents = students.length;

        const ssc = students.filter(s => s.informationType === 'SSC').length;
        const hsc = students.filter(s => s.informationType === 'HSC').length;

        this.studentTypeData = {
          labels: ['SSC', 'HSC'],
          datasets: [
            {
              data: [ssc, hsc],
              backgroundColor: ['#3b82f6', '#f59e0b']
            }
          ]
        };
      }
    });

    // ✅ Load users
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.totalUsers = users.length;

        const roles = ['SuperAdmin', 'Admin', 'Branch'];
        const counts = roles.map(r => users.filter(u => u.userType === r).length);

        this.userTypeData = {
          labels: roles,
          datasets: [
            {
              data: counts,
              backgroundColor: ['#10b981', '#6366f1', '#f43f5e']
            }
          ]
        };
      }
    });
  }
}
