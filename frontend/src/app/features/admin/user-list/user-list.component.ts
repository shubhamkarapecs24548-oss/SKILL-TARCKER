import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-list.component.html'
})
export class UserListComponent implements OnInit {
  users: any[] = [];
  loading = true;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.adminService.getUsers().subscribe(data => {
      this.users = data;
      this.loading = false;
    });
  }

  changeRole(user: any, newRole: string) {
    this.adminService.updateUserRole(user._id, newRole).subscribe(() => {
      this.loadUsers();
    });
  }

  deleteUser(user: any) {
    if (confirm(`Are you sure you want to delete ${user.name}? This will also delete all their skills.`)) {
      this.adminService.deleteUser(user._id).subscribe(() => {
        this.loadUsers();
      });
    }
  }
}
